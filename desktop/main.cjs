/**
 * Standalone Electron Launcher for Tadjmeel Clinica Desktop Apps
 * Usage:
 *   npx electron desktop/main.cjs --app=worker
 *   npx electron desktop/main.cjs --app=doctor
 */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Read argument --app=worker or --app=doctor
const args = process.argv.slice(2);
const appTypeArg = args.find((a) => a.startsWith('--app='));
const appType = appTypeArg ? appTypeArg.split('=')[1] : 'doctor';

const isDoctor = appType === 'doctor';
const targetHtml = isDoctor ? 'doctor.html' : 'worker.html';
const appName = isDoctor ? 'TadjmeelClinica-Doctor' : 'TadjmeelClinica-Worker';
const appTitle = isDoctor
  ? 'Tadjmeel Clinica — Console Clinique Médecin & Dossiers Médicaux'
  : 'Tadjmeel Clinica — Logiciel Réceptionniste, Caisse & Agenda';

// 1. Fix Windows "Unable to move cache / Access is denied" conflict:
// Set isolated user data directory in OS temp or local app data
try {
  const customUserData = path.join(os.tmpdir(), 'tadjmeel-desktop-data', appName);
  if (!fs.existsSync(customUserData)) {
    fs.mkdirSync(customUserData, { recursive: true });
  }
  app.setPath('userData', customUserData);
} catch (e) {
  console.warn('Could not set custom userData:', e);
}

// 2. Prevent GPU cache lock errors on Windows
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('no-sandbox');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: appTitle,
    backgroundColor: '#12110f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  Menu.setApplicationMenu(null); // Clean kiosk/desktop look without default menu bar

  // Check dev server or dist build
  const devUrl = `http://localhost:3000/${targetHtml}`;
  win.loadURL(devUrl).catch(() => {
    // If dev server is not running, load local production dist file
    win.loadFile(path.join(__dirname, '../dist', targetHtml));
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
