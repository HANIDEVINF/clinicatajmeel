/**
 * Login Component for Worker/Doctor Portals
 */

import React, { useState } from 'react';
import { AlertCircle, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  portalType: 'worker' | 'doctor';
}

export function LoginScreen({ onLoginSuccess, portalType }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de la connexion');
      }

      // Verify role matches portal type
      const expectedRole = portalType === 'worker' ? 'worker' : 'doctor';
      if (data.user.role !== expectedRole && data.user.role !== 'admin') {
        throw new Error(`Accès refusé. Ce portail est réservé aux ${portalType === 'worker' ? 'réceptionnistes' : 'médecins'}.`);
      }

      // Store token and user info
      localStorage.setItem('tadjmeel_token', data.token);
      localStorage.setItem('tadjmeel_user', JSON.stringify(data.user));

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const portalTitle = portalType === 'worker'
    ? 'Portail Réceptionniste'
    : 'Portail Médecin';

  const placeholderUsername = portalType === 'worker'
    ? 'receptionniste'
    : 'dr.ines, dr.karim, sarah';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12110f] via-[#1a1815] to-[#12110f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#c49b4b]/10 p-4 rounded-2xl mb-4">
            <Lock className="w-12 h-12 text-[#c49b4b]" />
          </div>
          <h1 className="text-3xl font-bold text-[#f5efe6] mb-2">
            Tadjmeel Clinica
          </h1>
          <p className="text-[#c49b4b] font-medium">{portalTitle}</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#26231e] border border-[#c49b4b]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#f5efe6] mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c49b4b]/60" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={placeholderUsername}
                  className="w-full pl-11 pr-4 py-3 bg-[#1a1815] border border-[#c49b4b]/20 rounded-lg text-[#f5efe6] placeholder-[#c49b4b]/40 focus:outline-none focus:ring-2 focus:ring-[#c49b4b] focus:border-transparent transition"
                  required
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#f5efe6] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c49b4b]/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[#1a1815] border border-[#c49b4b]/20 rounded-lg text-[#f5efe6] placeholder-[#c49b4b]/40 focus:outline-none focus:ring-2 focus:ring-[#c49b4b] focus:border-transparent transition"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c49b4b]/60 hover:text-[#c49b4b] transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c49b4b] hover:bg-[#dfba6d] text-[#1c1a17] font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-[#c49b4b]/20">
            <p className="text-xs text-[#c49b4b]/60 text-center">
              {portalType === 'worker' && 'Accès réservé au personnel administratif de la clinique'}
              {portalType === 'doctor' && 'Accès réservé aux médecins et praticiens'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#c49b4b]/40">
            Système sécurisé par authentification JWT
          </p>
        </div>
      </div>
    </div>
  );
}
