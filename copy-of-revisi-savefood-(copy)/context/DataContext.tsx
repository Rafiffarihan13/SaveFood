import React, { createContext, useState, useEffect, useContext } from 'react';
import { Role, type FoodItem, type Reservation, type Restaurant, type User } from '../types';
import { AuthContext } from './AuthContext';

// --- MOCK DATA ---
const initialFoodItems: FoodItem[] = [
    { id: 'food-1', restaurantId: 'resto-1', name: 'Croissant Coklat', description: 'Croissant renyah dengan isian coklat premium yang meleleh di mulut.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=870&auto=format&fit=crop', stock: 5, originalPrice: 20000, discountedPrice: 10000, availableUntil: new Date(Date.now() + 2 * 60 * 60 * 1000), isSurpriseMeal: false, category: 'Roti', pickupAddress: 'Jl. Roti Enak No. 1', pickupLat: -6.21, pickupLng: 106.81, qualityNotes: 'Freshly baked this morning.' },
    { id: 'food-3', restaurantId: 'resto-3', name: 'Surprise Pastry Box', description: 'Kotak kejutan berisi aneka macam kue dan roti pilihan dari chef kami hari ini. Isinya berbeda setiap hari!', imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=774&auto=format&fit=crop', stock: 10, originalPrice: 50000, discountedPrice: 0, availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), isSurpriseMeal: true, category: 'Kue', pickupAddress: 'Jl. Kafein No. 10', pickupLat: -6.20, pickupLng: 106.83 },
    { id: 'food-4', restaurantId: 'resto-1', name: 'Roti Gandum', description: 'Roti gandum utuh yang sehat dan kaya serat, cocok untuk sarapan atau camilan sehat.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=872&auto=format&fit=crop', stock: 2, originalPrice: 25000, discountedPrice: 0, availableUntil: new Date(Date.now() + 0.5 * 60 * 60 * 1000), isSurpriseMeal: false, category: 'Roti', pickupAddress: 'Jl. Roti Enak No. 1', pickupLat: -6.21, pickupLng: 106.81, qualityNotes: 'Best consumed today.' },
];

// --- CONTEXT ---
interface DataContextType {
  foodItems: FoodItem[];
  reservations: Reservation[];
  getRestaurantById: (id: string) => Restaurant | undefined;
  getUserById: (id: string) => User | undefined;
  getFoodItemById: (id: string) => FoodItem | undefined;
  getPopularRestaurants: () => Restaurant[];
  createReservation: (foodItemId: string) => Reservation;
  addFoodItem: (formData: any) => void;
  getReservationsForPartner: (partnerId: string) => Reservation[];
  getReservationsForUser: (userId: string) => Reservation[];
  getFoodItemsForPartner: (partnerId: string) => FoodItem[];
  completeReservation: (code: string) => void;
  getPartnerAnalytics: (partnerId: string) => any;
  // Wishlist
  isWishlisted: (foodItemId: string) => boolean;
  addToWishlist: (foodItemId: string) => void;
  removeFromWishlist: (foodItemId: string) => void;
  getWishlistedItems: () => FoodItem[];
  // Partner Controls
  extendPickupTime: (foodItemId: string, hours: number) => void;
  retractFoodItem: (foodItemId: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [completedReservations, setCompletedReservations] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Record<string, string[]>>({}); // userId -> foodItemId[]

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('DataProvider must be used within an AuthProvider');
  }
  const { users, restaurants, updateRestaurantPoints, currentUser } = authContext;

  const getFoodItemById = (id: string) => foodItems.find(f => f.id === id);
  
  useEffect(() => {
    // This interval can be used for real-time updates if needed, but for now,
    // we let the UI handle displaying items whose pickup time has passed.
    const interval = setInterval(() => {
        // Force a re-render to update countdowns, etc.
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getRestaurantById = (id: string) => restaurants.find(r => r.id === id);
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const getPopularRestaurants = () => [...restaurants].sort((a,b) => b.rewardPoints - a.rewardPoints).slice(0, 4);

  const createReservation = (foodItemId: string): Reservation => {
    if (!currentUser || currentUser.role !== Role.USER) {
        throw new Error("error.onlyUsersCanReserve");
    }
    const foodItem = getFoodItemById(foodItemId);
    if (!foodItem || foodItem.stock <= 0) {
      throw new Error('error.foodUnavailable');
    }
     if (new Date(foodItem.availableUntil) < new Date()) {
      throw new Error('error.pickupTimeEnded');
    }

    setFoodItems(prev => prev.map(item => item.id === foodItemId ? { ...item, stock: item.stock - 1 } : item));
    
    const reservationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      userId: currentUser.id,
      foodItemId,
      reservationCode,
      qrCodeValue: `SAVEFOOD_${reservationCode}`,
      createdAt: new Date(),
      status: 'active'
    };
    setReservations(prev => [...prev, newReservation]);
    return newReservation;
  };
  
  const addFoodItem = (formData: any) => {
    if (!currentUser || currentUser.role !== Role.PARTNER) {
        throw new Error("error.onlyPartnersCanPost");
    }
    const newFoodItem: FoodItem = {
        id: `food-${Date.now()}`,
        restaurantId: currentUser.id,
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        stock: parseInt(formData.stock, 10),
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        availableUntil: formData.availableUntil,
        isSurpriseMeal: formData.isSurpriseMeal,
        category: formData.category,
        pickupAddress: formData.pickupAddress,
        pickupLat: formData.lat,
        pickupLng: formData.lng,
        qualityNotes: formData.qualityNotes,
    };
    setFoodItems(prev => [newFoodItem, ...prev]);
  };
  
  const getReservationsForPartner = (partnerId: string) => {
    return reservations.filter(res => {
        const food = getFoodItemById(res.foodItemId);
        return food?.restaurantId === partnerId && res.status === 'active';
    });
  };
  
  const getReservationsForUser = (userId: string) => {
    return reservations
      .filter(res => res.userId === userId)
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getFoodItemsForPartner = (partnerId: string) => {
    return foodItems
      .filter(item => item.restaurantId === partnerId)
      .sort((a, b) => new Date(a.availableUntil).getTime() - new Date(b.availableUntil).getTime());
  };

  const completeReservation = (code: string) => {
    const reservationIndex = reservations.findIndex(r => r.reservationCode.toUpperCase() === code.toUpperCase() && r.status === 'active');
    if (reservationIndex === -1) {
        throw new Error('error.invalidReservationCode');
    }

    const reservation = reservations[reservationIndex];
    
    const updatedReservations = [...reservations];
    updatedReservations[reservationIndex] = {...reservation, status: 'completed'};
    setReservations(updatedReservations);
    
    const food = getFoodItemById(reservation.foodItemId);
    if (food && food.discountedPrice === 0) {
        updateRestaurantPoints(food.restaurantId, 10);
    }
    
    const user = getUserById(reservation.userId);
    setCompletedReservations(prev => [...prev, {
      id: reservation.id,
      foodName: food?.name,
      userName: user?.name,
      completedAt: new Date(),
      restaurantId: food?.restaurantId,
    }]);
  };
  
  const getPartnerAnalytics = (partnerId: string) => {
    const partner = getRestaurantById(partnerId);
    const history = completedReservations.filter(r => r.restaurantId === partnerId);
    const unclaimed = foodItems.filter(item => item.restaurantId === partnerId && new Date(item.availableUntil) < new Date() && item.stock > 0).length;
    return {
        portionsSaved: history.length,
        rewardPoints: partner?.rewardPoints ?? 0,
        history,
        unclaimedItems: unclaimed,
    };
  };

  // --- Wishlist Functions ---
  const isWishlisted = (foodItemId: string): boolean => {
    if (!currentUser) return false;
    return wishlist[currentUser.id]?.includes(foodItemId) ?? false;
  };

  const addToWishlist = (foodItemId: string) => {
    if (!currentUser) return;
    setWishlist(prev => {
        const userWishlist = prev[currentUser.id] ?? [];
        if (!userWishlist.includes(foodItemId)) {
            return { ...prev, [currentUser.id]: [...userWishlist, foodItemId] };
        }
        return prev;
    });
  };

  const removeFromWishlist = (foodItemId: string) => {
    if (!currentUser) return;
    setWishlist(prev => {
        const userWishlist = prev[currentUser.id] ?? [];
        return { ...prev, [currentUser.id]: userWishlist.filter(id => id !== foodItemId) };
    });
  };

  const getWishlistedItems = (): FoodItem[] => {
      if (!currentUser) return [];
      const userWishlistIds = wishlist[currentUser.id] ?? [];
      return foodItems.filter(item => userWishlistIds.includes(item.id));
  };
  
  // --- Partner Control Functions ---
  const extendPickupTime = (foodItemId: string, hours: number) => {
      setFoodItems(prev => prev.map(item => 
          item.id === foodItemId 
          ? { ...item, availableUntil: new Date(item.availableUntil.getTime() + hours * 3600000) } 
          : item
      ));
  };

  const retractFoodItem = (foodItemId: string) => {
      setFoodItems(prev => prev.map(item => 
          item.id === foodItemId 
          ? { ...item, stock: 0, availableUntil: new Date() } // Set stock to 0 and end pickup time
          : item
      ));
      // Cancel active reservations for this item
      setReservations(prev => prev.map(res => 
          res.foodItemId === foodItemId && res.status === 'active' 
          ? { ...res, status: 'cancelled' } 
          : res
      ));
  };


  return (
    <DataContext.Provider value={{ foodItems, reservations, getRestaurantById, getUserById, getFoodItemById, getPopularRestaurants, createReservation, addFoodItem, getReservationsForPartner, getReservationsForUser, completeReservation, getPartnerAnalytics, getFoodItemsForPartner, isWishlisted, addToWishlist, removeFromWishlist, getWishlistedItems, extendPickupTime, retractFoodItem }}>
      {children}
    </DataContext.Provider>
  );
};