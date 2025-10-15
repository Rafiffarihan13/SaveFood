import React, { useContext, useMemo } from 'react';
import { Home, ShoppingCart, Heart } from 'lucide-react';
import type { UserView } from '../pages/UserHomePage';
import { LanguageContext } from '../context/ThemeContext';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

interface BottomNavProps {
  activeTab: UserView;
  onTabChange: (tab: UserView) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'}`}>
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    const { t } = useContext(LanguageContext)!;
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);

    const activeReservationsCount = useMemo(() => {
        if (authContext?.currentUser && dataContext) {
            return dataContext.getReservationsForUser(authContext.currentUser.id)
                .filter(r => {
                    const foodItem = dataContext.getFoodItemById(r.foodItemId);
                    return r.status === 'active' && foodItem && new Date(foodItem.availableUntil) > new Date();
                }).length;
        }
        return 0;
    }, [dataContext, authContext?.currentUser, dataContext?.reservations, dataContext?.foodItems]);


    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] dark:bg-gray-800 dark:border-gray-700">
            <NavItem
                icon={<Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />}
                label={t('home')}
                isActive={activeTab === 'home'}
                onClick={() => onTabChange('home')}
            />
            <NavItem
                icon={
                    <div className="relative">
                        <ShoppingCart size={24} strokeWidth={activeTab === 'reservations' ? 2.5 : 2} />
                        {activeReservationsCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                {activeReservationsCount}
                            </span>
                        )}
                    </div>
                }
                label={t('cart')}
                isActive={activeTab === 'reservations'}
                onClick={() => onTabChange('reservations')}
            />
        </nav>
    );
}

export default BottomNav;