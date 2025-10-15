import React, { useState, useMemo, useContext } from 'react';
import type { FoodItem } from '../../types';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/ThemeContext';
import FoodCard from '../FoodCard';
import Header from '../Header';
import { Search, Flame } from 'lucide-react';

interface UserDashboardProps {
  onSelectFoodItem: (foodItem: FoodItem) => void;
  onProfileClick: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onSelectFoodItem, onProfileClick }) => {
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const { t } = useContext(LanguageContext)!;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const foodItems = dataContext?.foodItems ?? [];
  const userName = authContext?.currentUser?.name.split(' ')[0] || 'Food Saver';

  const categoryTranslationMap: { [key: string]: string } = {
    'All': 'category.all',
    'Makanan Berat': 'heavyMeal',
    'Roti': 'bread',
    'Minuman': 'beverage',
    'Kue': 'cake',
    'Lainnya': 'other',
  };

  const { urgentItems, filteredFoodItems } = useMemo(() => {
    let items = foodItems.filter(item => item.stock > 0 && new Date(item.availableUntil) > new Date());
    
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const urgent = items.filter(item => new Date(item.availableUntil) < twoHoursFromNow).sort((a,b) => new Date(a.availableUntil).getTime() - new Date(b.availableUntil).getTime());

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowercasedTerm) ||
        dataContext?.getRestaurantById(item.restaurantId)?.name.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    return { urgentItems: urgent, filteredFoodItems: items };
  }, [foodItems, searchTerm, activeCategory, dataContext]);
  
  const categories = useMemo(() => {
    const allCategories = foodItems.map(item => item.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [foodItems]);

  return (
    <>
      <Header title={t('savefood')} variant="primary" onProfileClick={onProfileClick} />
      <div className="p-4 space-y-6">
        <div>
            {/* FIX: Renamed translation key from 'welcome' to 'welcomeGreeting' to avoid conflict. */}
            <h1 className="text-2xl font-bold text-dark dark:text-light">{t('welcomeGreeting', { name: userName })}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-[15px]">{t('welcomeSubtitle')}</p>
        </div>

        <div className="relative">
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-dark placeholder-gray-500 rounded-full focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        </div>
        
        {urgentItems.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-dark dark:text-light mb-3 flex items-center gap-2"><Flame className="text-secondary"/> {t('grabItFast')}</h2>
             <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
              {urgentItems.map(item => (
                <div key={item.id} className="w-48 flex-shrink-0">
                  <FoodCard foodItem={item} onClick={() => onSelectFoodItem(item)} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-dark dark:text-light mb-3">{t('allFood')}</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4">
            {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)} 
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white shadow' : 'bg-white text-gray-700 border dark:bg-slate-700 dark:text-light dark:border-slate-600'}`}
                >
                    {t(categoryTranslationMap[cat] || cat)}
                </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mt-4">
            {filteredFoodItems.map(item => (
              <FoodCard key={item.id} foodItem={item} onClick={() => onSelectFoodItem(item)} />
            ))}
          </div>
          {filteredFoodItems.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p className="font-semibold">{t('noFoodFoundTitle')}</p>
              <p className="text-sm">{t('noFoodFoundSubtitle')}</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default UserDashboard;