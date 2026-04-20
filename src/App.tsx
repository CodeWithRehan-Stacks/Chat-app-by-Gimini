/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1A1D21]">
        <Loader2 className="w-10 h-10 text-[#D7263D] animate-spin" />
      </div>
    );
  }

  return user ? (
    <ChatProvider>
      <Dashboard />
    </ChatProvider>
  ) : (
    <AuthPage />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
