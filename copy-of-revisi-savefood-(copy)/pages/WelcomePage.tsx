import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/ThemeContext';
import { Role } from '../types';

interface InfoCardProps {
    icon: string;
    title: string;
    description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border dark:border-slate-700 flex items-start gap-4">
        <span className="text-3xl mt-1">{icon}</span>
        <div>
            <h3 className="font-bold text-lg text-dark dark:text-light">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);

const WelcomePage: React.FC = () => {
    const { currentUser, clearNewUserFlag } = useContext(AuthContext)!;
    const { t } = useContext(LanguageContext)!;

    if (!currentUser) return null; // Should not happen in this flow

    const isUser = currentUser.role === Role.USER;

    const UserOnboarding = () => (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-dark dark:text-light">
                   {t('welcome.user.title')} <span role="img" aria-label="waving hand">👋</span>
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('welcome.user.subtitle')}</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark dark:text-light text-center">{t('welcome.user.howTo.title')}</h2>
                <div className="space-y-3">
                    <InfoCard icon="🔍" title={t('welcome.user.howTo.find.title')} description={t('welcome.user.howTo.find.desc')} />
                    <InfoCard icon="📱" title={t('welcome.user.howTo.reserve.title')} description={t('welcome.user.howTo.reserve.desc')} />
                    <InfoCard icon="🏃" title={t('welcome.user.howTo.pickup.title')} description={t('welcome.user.howTo.pickup.desc')} />
                </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-lg text-green-800 dark:text-green-300 mb-2">{t('welcome.user.tips.title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>{t('welcome.user.tips.notifications')}</li>
                    <li>{t('welcome.user.tips.distance')}</li>
                    <li>{t('welcome.user.tips.pickupTime')}</li>
                </ul>
            </div>
            
            <button
                onClick={clearNewUserFlag}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                {t('welcome.user.button')}
            </button>
        </>
    );

    const PartnerOnboarding = () => (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-dark dark:text-light">
                   {t('welcome.partner.title')} <span role="img" aria-label="handshake">🤝</span>
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('welcome.partner.subtitle')}</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark dark:text-light text-center">{t('welcome.partner.howTo.title')}</h2>
                 <div className="space-y-3">
                    <InfoCard icon="📸" title={t('welcome.partner.howTo.upload.title')} description={t('welcome.partner.howTo.upload.desc')} />
                    <InfoCard icon="⏰" title={t('welcome.partner.howTo.setTime.title')} description={t('welcome.partner.howTo.setTime.desc')} />
                    <InfoCard icon="📊" title={t('welcome.partner.howTo.getPoints.title')} description={t('welcome.partner.howTo.getPoints.desc')} />
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                 <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">{t('welcome.partner.benefits.title')}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>{t('welcome.partner.benefits.waste')}</li>
                    <li>{t('welcome.partner.benefits.reputation')}</li>
                    <li>{t('welcome.partner.benefits.customers')}</li>
                    <li>{t('welcome.partner.benefits.recognition')}</li>
                </ul>
            </div>
            
            <button
                onClick={clearNewUserFlag}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                {t('welcome.partner.button')}
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
                {isUser ? <UserOnboarding /> : <PartnerOnboarding />}
            </div>
        </div>
    );
};

export default WelcomePage;
