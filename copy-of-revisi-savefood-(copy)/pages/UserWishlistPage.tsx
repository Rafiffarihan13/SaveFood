import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import FoodCard from '../components/FoodCard';
import type { FoodItem } from '../types';
import { Heart, ChevronLeft } from 'lucide-react';
import { LanguageContext } from '../context/ThemeContext';

interface UserWishlistPageProps {
    onSelectFoodItem: (foodItem: FoodItem) => void;
    onBack: () => void;
}

const UserWishlistPage: React.FC<UserWishlistPageProps> = ({ onSelectFoodItem, onBack }) => {
    const dataContext = useContext(DataContext);
    const { t } = useContext(LanguageContext)!;

    const wishlistedItems = dataContext?.getWishlistedItems() ?? [];

    return (
         <>
            <header className="bg-primary text-white shadow-sm p-4 flex items-center sticky top-0 z-40">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-primary-dark transition-colors">
                    <ChevronLeft />
                </button>
                <h1 className="text-xl font-bold">{t('myWishlistTitle')}</h1>
            </header>
            <div className="p-4 space-y-6">
                {wishlistedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlistedItems.map(item => (
                          <FoodCard key={item.id} foodItem={item} onClick={() => onSelectFoodItem(item)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="font-semibold text-lg">{t('wishlistEmptyTitle')}</p>
                        <p className="text-sm mt-1">{t('wishlistEmptySubtitle')}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserWishlistPage;