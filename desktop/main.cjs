/**
 * Standalone Electron Launcher for Tadjmeel Clinica Desktop Apps
 * Usage:
 *   npx electron desktop/main.cjs --app=worker
 *   npx electron desktop/main.cjs --app=doctor
 */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Read argument --app=worker or --app=doctor
const args = process.argv.slice(2);
const appTypeArg = args.find((a) => a.startsWith('--app='));
const appType = appTypeArg ? appTypeArg.split('=')[1] : 'worker';

const isDoctor = appType === 'doctor';
const targetHtml = isDoctor ? 'doctor.html' : 'worker.html';
const appTitle = isDoctor
  ? 'Tadjmeel Clinica — Console Clinique Médecin & Dossiers Médicaux'
  : 'Tadjmeel Clinica — Logiciel Réceptionniste, Caisse & Agenda';

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
