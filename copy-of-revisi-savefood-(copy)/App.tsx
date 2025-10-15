import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
// FIX: Corrected the import path for ThemeProvider and LanguageProvider.
import { ThemeProvider, LanguageProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import UserHomePage from './pages/UserHomePage';
import PartnerHomePage from './pages/PartnerHomePage';
import WelcomePage from './pages/WelcomePage';
// FIX: Import 'Role' as a value, not just a type, to use its members at runtime.
import { Role } from './types';

const AppContent: React.FC = () => {
    const authContext = useContext(AuthContext);

    // Using component state for navigation instead of HashRouter to simplify logic
    const [page, setPage] = useState<'landing' | 'login' | 'register'>('landing');
    // FIX: Initialize state with the enum member `Role.USER` for type safety.
    const [authRole, setAuthRole] = useState<Role>(Role.USER);

    const handleNavigation = (targetPage: 'login' | 'register', role: Role) => {
        setAuthRole(role);
        setPage(targetPage);
    };
    
    if (authContext?.isAuthenticated) {
        if (authContext.isNewUser) {
            return <WelcomePage />;
        }
        if (authContext.currentUser?.role === 'USER') {
            return <UserHomePage />;
        }
        if (authContext.currentUser?.role === 'PARTNER') {
            return <PartnerHomePage />;
        }
    }

    switch(page) {
        case 'login':
            return <AuthPage mode="login" role={authRole} onBack={() => setPage('landing')} />;
        case 'register':
            return <AuthPage mode="register" role={authRole} onBack={() => setPage('landing')} />;
        case 'landing':
        default:
            return <LandingPage onNavigate={handleNavigation} />;
    }
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
