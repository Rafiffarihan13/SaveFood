import React, { useContext } from 'react';
import type { FoodItem } from '../../types';
import { DataContext } from '../../context/DataContext';
import { ChevronLeft, MapPin, Clock, Box, Sparkles, Tag, ClipboardList, Star, ExternalLink, MessageSquareQuote } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import { LanguageContext } from '../../context/ThemeContext';

interface FoodDetailProps {
  foodItem: FoodItem;
  onBack: () => void;
  onReserve: (foodItem: FoodItem) => void;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ foodItem, onBack, onReserve }) => {
  const dataContext = useContext(DataContext);
  const { t } = useContext(LanguageContext)!;
  const restaurant = dataContext?.getRestaurantById(foodItem.restaurantId);

  if (!restaurant) return null;

  const isFree = foodItem.discountedPrice === 0;
  
  const lat = foodItem.pickupLat ?? restaurant.lat;
  const lng = foodItem.pickupLng ?? restaurant.lng;
  
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const isAvailable = new Date(foodItem.availableUntil) > new Date();

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div className="relative h-64">
        <img src={foodItem.imageUrl} alt={foodItem.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white dark:bg-dark/80 dark:text-light dark:hover:bg-dark">
          <ChevronLeft className="text-dark dark:text-light" />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold ">{foodItem.name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-lg">{restaurant.name}</p>
              {restaurant.rewardPoints > 1000 && <Star size={18} className="text-yellow-300 fill-yellow-300" />}
            </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 rounded-t-2xl -mt-4 p-4 space-y-6 pb-24">
        {foodItem.isSurpriseMeal && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-300" role="alert">
                <p className="font-bold flex items-center gap-2"><Sparkles size={20}/> {t('surpriseMealTitle')}</p>
                <p className="text-sm mt-1">{t('surpriseMealBody')}</p>
            </div>
        )}
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="flex flex-col items-center">
                    <Box className="text-primary mb-1" />
                    <span className="font-bold text-lg text-dark dark:text-light">{foodItem.stock} {t('portions')}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('remaining')}</span>
                </div>
                <div className="flex flex-col items-center">
                    <Clock className="text-primary mb-1" />
                    <span className="font-bold text-lg text-dark dark:text-light">{new Date(foodItem.availableUntil).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('pickupUntil')}</span>
                </div>
            </div>
            {isAvailable && (
                 <div className="text-center border-t dark:border-slate-700 pt-3">
                    <CountdownTimer availableUntil={foodItem.availableUntil} onExpire={() => { /* maybe refresh data */ }} />
                 </div>
            )}
        </div>

        {foodItem.qualityNotes && (
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-dark dark:text-light"><MessageSquareQuote size={20} className="text-primary"/> {t('qualityNotes')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{foodItem.qualityNotes}</p>
            </div>
        )}

        {foodItem.description && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-dark dark:text-light"><ClipboardList size={20} className="text-primary"/> {t('description')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{foodItem.description}</p>
            </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-dark dark:text-light"><Tag size={20} className="text-primary"/> {t('price')}</h3>
            {isFree ? (
                <p className="text-3xl font-bold text-primary">{t('free')}</p>
            ) : (
                <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-primary">{t('rp')} {foodItem.discountedPrice.toLocaleString()}</p>
                    <p className="text-lg text-gray-500 dark:text-gray-400 line-through">{t('rp')} {foodItem.originalPrice.toLocaleString()}</p>
                </div>
            )}
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:border dark:border-slate-700">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-dark dark:text-light"><MapPin size={20} className="text-primary"/> {t('pickupLocation')}</h3>
            <div className="flex items-center gap-2">
              <p className="text-gray-700 dark:text-gray-300 font-semibold">{restaurant.name}</p>
              {restaurant.rewardPoints > 1000 && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
            </div>
             <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 text-sm hover:underline">
                {foodItem.pickupAddress}
            </a>
            <div className="mt-2 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                <iframe
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${lat},${lng}&output=embed&z=15`}>
                </iframe>
                 <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white/80 dark:bg-dark/80 backdrop-blur-sm text-dark dark:text-light text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1 hover:bg-white dark:hover:bg-dark transition-colors" title={t('openMap')}>
                    <ExternalLink size={12}/>
                    <span>{t('openMap')}</span>
                </a>
            </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t dark:bg-slate-900/80 dark:border-slate-700">
        <button 
          onClick={() => onReserve(foodItem)}
          disabled={foodItem.stock <= 0 || !isAvailable}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-primary/30">
          {foodItem.stock <= 0 ? t('soldOut') : !isAvailable ? t('timeUp') : t('reserveNow')}
        </button>
      </div>
    </div>
  );
};

export default FoodDetail;