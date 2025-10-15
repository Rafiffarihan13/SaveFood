import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import type { FoodItem, Reservation } from '../types';
import { Ticket, History, Info } from 'lucide-react';
import { LanguageContext } from '../context/ThemeContext';

interface UserReservationsPageProps {
    onSelectFoodItem: (foodItem: FoodItem) => void;
    onProfileClick: () => void;
}

const ReservationCard: React.FC<{reservation: Reservation}> = ({ reservation }) => {
    const dataContext = useContext(DataContext);
    const { t } = useContext(LanguageContext)!;
    const foodItem = dataContext?.getFoodItemById(reservation.foodItemId);
    const restaurant = foodItem ? dataContext?.getRestaurantById(foodItem.restaurantId) : null;

    if (!foodItem || !restaurant) {
        return (
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                <p className="font-semibold text-red-600 dark:text-red-400">{t('incompleteReservationInfo')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('incompleteReservationInfoDesc')}</p>
            </div>
        );
    }
    
    const isPickupTimeOver = new Date(foodItem.availableUntil) < new Date();
    const isCompleted = reservation.status === 'completed';
    const isActive = reservation.status === 'active' && !isPickupTimeOver;
    
    let statusPill;
    if (isCompleted) {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">{t('completed')}</div>;
    } else if (isActive) {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300">{t('active')}</div>;
    } else {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300">{t('timeUp')}</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{restaurant.name}</p>
                    <p className="font-bold text-lg text-dark dark:text-light">{foodItem.name}</p>
                </div>
                {statusPill}
            </div>
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm space-y-2">
                <div className="flex justify-between text-dark dark:text-light">
                    <span className="text-gray-600 dark:text-gray-300">{t('date')}</span>
                    <span className="font-medium">{new Date(reservation.createdAt).toLocaleDateString()}</span>
                </div>
                 {isActive && (
                    <div className="flex justify-between items-center pt-2 border-t dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-300">{t('codeLabel')}</span>
                        <span className="font-mono text-lg font-bold text-primary tracking-widest">{reservation.reservationCode}</span>
                    </div>
                 )}
            </div>
        </div>
    );
}


const UserReservationsPage: React.FC<UserReservationsPageProps> = ({ onSelectFoodItem, onProfileClick }) => {
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);
    const { t } = useContext(LanguageContext)!;

    const reservations = useMemo(() => {
        if (authContext?.currentUser) {
            return dataContext?.getReservationsForUser(authContext.currentUser.id) ?? [];
        }
        return [];
    }, [dataContext, authContext?.currentUser, dataContext?.reservations]);
    
    const activeReservations = reservations.filter(r => {
        const foodItem = dataContext?.getFoodItemById(r.foodItemId);
        return r.status === 'active' && foodItem && new Date(foodItem.availableUntil) > new Date();
    });
    const pastReservations = reservations.filter(r => {
        const foodItem = dataContext?.getFoodItemById(r.foodItemId);
        return r.status !== 'active' || !foodItem || new Date(foodItem.availableUntil) <= new Date();
    });

    return (
         <>
            <Header title={t('myReservationsTitle')} variant="primary" onProfileClick={onProfileClick}/>
            <div className="p-4 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-dark dark:text-light mb-3 flex items-center gap-2"><Ticket className="text-primary"/> {t('activeReservations')}</h2>
                    {activeReservations.length > 0 ? (
                        <div className="space-y-4">
                            {activeReservations.map(res => <ReservationCard key={res.id} reservation={res} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:border dark:border-slate-700">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">{t('noActiveReservations')}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('goSaveFood')}</p>
                        </div>
                    )}
                </section>
                
                 <section>
                    <h2 className="text-xl font-bold text-dark dark:text-light mb-3 flex items-center gap-2"><History className="text-primary"/> {t('history')}</h2>
                    {pastReservations.length > 0 ? (
                        <div className="space-y-4">
                            {pastReservations.map(res => <ReservationCard key={res.id} reservation={res} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:border dark:border-slate-700">
                            <Info size={24} className="mx-auto text-gray-400 mb-2"/>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('historyWillAppearHere')}</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default UserReservationsPage;