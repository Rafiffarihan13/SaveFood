import React, { useContext } from 'react';
import { ChevronLeft, Leaf, Star, Inbox } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/ThemeContext';

interface PartnerAnalyticsProps {
  onBack: () => void;
}

const PartnerAnalytics: React.FC<PartnerAnalyticsProps> = ({ onBack }) => {
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);
    const { t } = useContext(LanguageContext)!;

    if (!authContext?.currentUser || authContext.currentUser.role !== 'PARTNER') {
        return <div>Access Denied</div>;
    }
    const partnerId = authContext.currentUser.id;
    const analytics = dataContext?.getPartnerAnalytics(partnerId);

    if (!analytics) return <p>Loading analytics...</p>;

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 mr-2 text-dark dark:text-light">
                    <ChevronLeft />
                </button>
                <h2 className="text-xl font-bold text-dark dark:text-light">{t('reportsAnalyticsTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnalyticsCard
                    icon={<Leaf size={24} className="text-green-500" />}
                    title={t('portionsSaved')}
                    value={analytics.portionsSaved}
                    description={t('portionsSavedDesc')}
                />
                <AnalyticsCard
                    icon={<Star size={24} className="text-yellow-500" />}
                    title={t('yourRewardPoints')}
                    value={analytics.rewardPoints}
                    description={t('rewardPointsDesc')}
                />
                 <AnalyticsCard
                    icon={<Inbox size={24} className="text-red-500" />}
                    title={t('unclaimedItems')}
                    value={analytics.unclaimedItems}
                    description={t('unclaimedItemsDesc')}
                />
            </div>
            {/* Add more analytics or charts here */}
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                <h3 className="font-bold text-lg mb-2 text-dark dark:text-light">{t('transactionHistory')}</h3>
                <div className="max-h-96 overflow-y-auto">
                    {analytics.history.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                           {analytics.history.map(item => (
                               <li key={item.id} className="py-3">
                                   <div className="flex justify-between">
                                       <div>
                                            <p className="font-semibold text-dark dark:text-light">{item.foodName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('by')}: {item.userName}</p>
                                       </div>
                                       <div className="text-right">
                                            <p className="font-semibold text-dark dark:text-light">{new Date(item.completedAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.completedAt).toLocaleTimeString()}</p>
                                       </div>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noTransactionHistory')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface AnalyticsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    description: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon, title, value, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                <p className="text-3xl font-bold text-dark dark:text-light">{value}</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{description}</p>
    </div>
);

export default PartnerAnalytics;