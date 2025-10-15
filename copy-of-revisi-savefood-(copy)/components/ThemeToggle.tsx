import React, { useContext } from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
// FIX: Corrected the import path for ThemeContext and LanguageContext.
import { ThemeContext, LanguageContext } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const themeContext = useContext(ThemeContext);
    const languageContext = useContext(LanguageContext);
    if (!themeContext || !languageContext) return null;
    
    const { theme, toggleTheme } = themeContext;
    const { t } = languageContext;
    const isDark = theme === 'dark';

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="text-primary">{isDark ? <Moon size={24} /> : <Sun size={24}/>}</div>
                <span className="font-semibold text-dark dark:text-light">{t(isDark ? 'darkMode' : 'lightMode')}</span>
            </div>
            <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}

export default ThemeToggle;


export const LanguageSwitcher: React.FC = () => {
    const languageContext = useContext(LanguageContext);
    if (!languageContext) return null;
    const { language, setLanguage, t } = languageContext;
    const isId = language === 'id';
    
    const toggleLanguage = () => {
        setLanguage(isId ? 'en' : 'id');
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="text-primary"><Globe size={24} /></div>
                <span className="font-semibold text-dark dark:text-light">{t('language')}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-sm">
                <span className={`${!isId ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>EN</span>
                <button onClick={toggleLanguage} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isId ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isId ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`${isId ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>ID</span>
            </div>
        </div>
    );
};