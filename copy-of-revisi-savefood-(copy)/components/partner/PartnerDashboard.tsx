import React, { useContext } from 'react';
import { UtensilsCrossed, PlusCircle, BarChart3, QrCode } from 'lucide-react';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../../context/ThemeContext';

interface PartnerDashboardProps {
    onNavigate: (view: 'post' | 'reservations' | 'analytics' | 'listings') => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext)!;
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-dark dark:text-light">{t('partnerDashboardTitle')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard 
          icon={<PlusCircle size={32} />} 
          title={t('postNewFood')} 
          description={t('postNewFoodDesc')}
          onClick={() => onNavigate('post')}
        />
        <DashboardCard 
          icon={<UtensilsCrossed size={32} />} 
          title={t('myListings')} 
          description={t('myListingsDesc')}
          onClick={() => onNavigate('listings')}
        />
        <DashboardCard 
          icon={<QrCode size={32} />} 
          title={t('manageReservations')} 
          description={t('manageReservationsDesc')}
          onClick={() => onNavigate('reservations')}
        />
        <DashboardCard 
          icon={<BarChart3 size={32} />} 
          title={t('reportsAnalytics')} 
          description={t('reportsAnalyticsDesc')}
          onClick={() => onNavigate('analytics')}
        />
      </div>
      {/* Can add some quick stats here */}
    </div>
  );
};

const DashboardCard: React.FC<{icon: React.ReactNode, title: string, description: string, onClick: () => void}> = ({ icon, title, description, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:border-primary border-2 border-transparent transition-all duration-300 flex items-start space-x-4">
        <div className="text-primary">{icon}</div>
        <div>
            <h3 className="font-bold text-lg text-dark dark:text-light">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>
        </div>
    </div>
);


export default PartnerDashboard;