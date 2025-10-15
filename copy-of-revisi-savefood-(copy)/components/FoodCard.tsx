import React, { useContext } from 'react';
import type { FoodItem } from '../types';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { Tag, Heart, Star, Clock, Package } from 'lucide-react';
import { LanguageContext } from '../context/ThemeContext';

interface FoodCardProps {
  foodItem: FoodItem;
  onClick: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem, onClick }) => {
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const { t } = useContext(LanguageContext)!;

  const restaurant = dataContext?.getRestaurantById(foodItem.restaurantId);
  const { currentUser } = authContext || {};
  const { isWishlisted, addToWishlist, removeFromWishlist } = dataContext || {};

  if (!restaurant) return null;

  const isFree = foodItem.discountedPrice === 0;
  const isLiked = currentUser && isWishlisted ? isWishlisted(foodItem.id) : false;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || !addToWishlist || !removeFromWishlist) return;

    if (isLiked) {
      removeFromWishlist(foodItem.id);
    } else {
      addToWishlist(foodItem.id);
    }
  };

  const pickupDeadline = new Date(foodItem.availableUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative w-full overflow-hidden aspect-square">
        <img src={foodItem.imageUrl} alt={foodItem.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {isFree && (
            <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                <Tag size={14}/>
                {t('freeTag')}
            </div>
        )}
         <button onClick={handleLikeClick} className="absolute top-2 left-2 bg-white/70 p-1.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 focus:outline-none transition-all duration-300 z-10" aria-label="Add to favorites">
            <Heart size={18} fill={isLiked ? "currentColor" : "none"}/>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-1.5">
             <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center">
                <span role="img" aria-label="store emoji" className="mr-1.5">🏪</span>
                {restaurant.name}
            </p>
            {restaurant.rewardPoints > 1000 && (
                <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
            )}
          </div>
          <h3 className="font-bold text-lg text-dark dark:text-light truncate mt-1">{foodItem.name}</h3>
          {foodItem.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{foodItem.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <div className="flex items-center gap-1">
                <Clock size={12}/>
                <span>{t('pickupUntil')} {pickupDeadline}</span>
            </div>
             <div className="flex items-center gap-1">
                <Package size={12} />
                <span>{foodItem.stock} {t('portions')}</span>
             </div>
        </div>
        <div className="mt-2 flex justify-between items-end">
          {isFree ? (
            <p className="text-2xl font-bold text-primary">{t('free')}</p>
          ) : (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-through">{t('rp')} {foodItem.originalPrice.toLocaleString()}</p>
              <p className="text-2xl font-bold text-primary">{t('rp')} {foodItem.discountedPrice.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;