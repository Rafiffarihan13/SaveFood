import React, { useContext } from 'react';
import { Leaf, User, Store } from 'lucide-react';
import { Role } from '../types';
import ThemeToggle, { LanguageSwitcher } from '../components/ThemeToggle';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';


interface LandingPageProps {
  onNavigate: (path: 'login' | 'register', role: Role) => void;
}

const BackgroundLeaves = () => (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        {/* Using a more curated set for a cleaner look */}
        
        {/* Corners */}
        <Leaf className="absolute -top-10 -left-12 text-green-200 dark:text-green-800/20 h-48 w-48 opacity-70 rotate-12" />
        <Leaf className="absolute -top-12 right-20 text-green-200 dark:text-green-800/20 h-40 w-40 opacity-60 rotate-[45deg]" />
        <Leaf className="absolute -bottom-16 -right-10 text-green-200 dark:text-green-800/20 h-56 w-56 opacity-80 -rotate-12" />
        <Leaf className="absolute -bottom-20 left-10 text-green-200 dark:text-green-800/20 h-36 w-36 opacity-50 rotate-[20deg]" />

        {/* Side Floaters */}
        <Leaf className="absolute top-1/3 -left-5 text-green-200 dark:text-green-800/20 h-28 w-28 opacity-40 rotate-[160deg]" />
        <Leaf className="absolute top-1/2 -right-12 -translate-y-1/2 text-green-200 dark:text-green-800/20 h-36 w-36 opacity-50 rotate-[200deg]" />
        <Leaf className="absolute bottom-1/4 -left-16 text-green-200 dark:text-green-800/20 h-40 w-40 opacity-70 rotate-[-25deg]" />
        <Leaf className="absolute top-10 right-5 text-green-200 dark:text-green-800/20 h-32 w-32 opacity-50 -rotate-45" />

        {/* Center Floaters (sparse) */}
        <Leaf className="absolute bottom-1/3 right-1/4 text-green-200 dark:text-green-800/20 h-16 w-16 opacity-60 rotate-[-60deg]" />
        <Leaf className="absolute top-1/4 left-1/4 text-green-200 dark:text-green-800/20 h-20 w-20 opacity-40 rotate-[30deg]" />
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext)!;

  const Settings = () => (
    <>
      <ThemeToggle />
      <LanguageSwitcher />
    </>
  );

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <BackgroundLeaves />

      {/* Settings for Tablet/Desktop */}
      <div className="absolute top-6 right-6 z-20 hidden md:block">
        <div className="space-y-4 w-64">
          <Settings />
        </div>
      </div>
      
      <main className="relative z-10 w-full flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-6 bg-white/70 dark:bg-dark/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-white/30 dark:border-gray-700">
            <Leaf className="mx-auto text-primary" size={64} />
            <h1 className="text-5xl font-bold text-dark dark:text-light mt-4">SaveFood</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-[22px]">{t('landingSubtitle')}</p>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="bg-white/70 dark:bg-dark/70 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-4 border border-white/30 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-center text-dark dark:text-light">{t('loginOrRegister')}</h2>
            <RoleButton 
              icon={<User />} 
              title={t('iAmAUser')}
              description={t('userDescription')}
              onLogin={() => onNavigate('login', Role.USER)}
              onRegister={() => onNavigate('register', Role.USER)}
            />
            <RoleButton 
              icon={<Store />} 
              title={t('iAmAPartner')}
              description={t('partnerDescription')}
              onLogin={() => onNavigate('login', Role.PARTNER)}
              onRegister={() => onNavigate('register', Role.PARTNER)}
            />
          </div>
        </div>
      </main>

      {/* Settings for Mobile */}
      <footer className="relative z-10 w-full max-w-md space-y-4 pt-6 md:hidden">
        <Settings />
      </footer>
    </div>
  );
};

interface RoleButtonProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onLogin: () => void;
    onRegister: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({ icon, title, description, onLogin, onRegister }) => {
    const { t } = useContext(LanguageContext)!;
    return (
        <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
            <div className="flex items-start space-x-4 mb-3">
                <div className="text-primary mt-1">{icon}</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-light">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onLogin} className="flex-1 bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary-dark">{t('login')}</button>
                <button onClick={onRegister} className="flex-1 bg-gray-200 text-dark font-semibold py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-light dark:hover:bg-gray-600">{t('register')}</button>
            </div>
        </div>
    );
};

export default LandingPage;