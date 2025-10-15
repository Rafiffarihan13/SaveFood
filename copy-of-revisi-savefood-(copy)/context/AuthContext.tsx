import React, { createContext, useState, useEffect } from 'react';
import { Role, type AuthenticatedUser, type Restaurant, type User } from '../types';

// --- MOCK DATA (MOVED FROM DataContext) ---
export const INITIAL_MOCK_RESTAURANTS: Restaurant[] = [
    { id: 'resto-1', name: 'Bakery Sehat', address: 'Jl. Roti Enak No. 1', type: 'Bakery', contact: '08123', rewardPoints: 150, lat: -6.21, lng: 106.81, role: Role.PARTNER, email: 'resto1@test.com', hasLoggedIn: true },
    { id: 'resto-2', name: 'Warung Nasi Ibu', address: 'Jl. Kenyang No. 5', type: 'Warung', contact: '08234', rewardPoints: 80, lat: -6.22, lng: 106.82, role: Role.PARTNER, email: 'resto2@test.com', hasLoggedIn: true },
    { id: 'resto-3', name: 'Kopi Pagi', address: 'Jl. Kafein No. 10', type: 'Kafe', contact: '08345', rewardPoints: 250, lat: -6.20, lng: 106.83, role: Role.PARTNER, email: 'resto3@test.com', hasLoggedIn: true },
];

export const INITIAL_MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Andi', email: 'andi@test.com', phone: '08987', role: Role.USER, hasLoggedIn: true }
];

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
  clearNewUserFlag: () => void;
  users: User[];
  restaurants: Restaurant[];
  updateRestaurantPoints: (restaurantId: string, points: number) => void;
  updateUserProfile: (userId: string, role: Role, details: Partial<User | Restaurant>) => Promise<void>;
  deleteUserProfile: (userId: string, role: Role) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_MOCK_USERS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_MOCK_RESTAURANTS);

  useEffect(() => {
    const storedUser = localStorage.getItem('savefood_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let user: (User | Restaurant) | undefined;
        let userIndex = -1;

        if (role === Role.USER) {
          userIndex = users.findIndex(u => u.email === email);
          if (userIndex > -1) user = users[userIndex];
        } else {
          userIndex = restaurants.findIndex(r => r.email === email);
          if (userIndex > -1) user = restaurants[userIndex];
        }

        if (user && userIndex > -1) {
          const isFirstLogin = !user.hasLoggedIn;
          let userToAuth = user;

          if (isFirstLogin) {
              userToAuth = { ...user, hasLoggedIn: true };
              
              if (role === Role.USER) {
                  setUsers(prev => {
                      const newUsers = [...prev];
                      newUsers[userIndex] = userToAuth as User;
                      return newUsers;
                  });
              } else {
                  setRestaurants(prev => {
                      const newRestaurants = [...prev];
                      newRestaurants[userIndex] = userToAuth as Restaurant;
                      return newRestaurants;
                  });
              }
          }
          
          setCurrentUser(userToAuth as AuthenticatedUser);
          setIsNewUser(isFirstLogin);
          localStorage.setItem('savefood_user', JSON.stringify(userToAuth));

          resolve();
        } else {
          reject(new Error('Email atau password salah.'));
        }
      }, 500);
    });
  };
  
  const register = async (details: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = users.some(u => u.email === details.email) || restaurants.some(r => r.email === details.email);
        if (emailExists) {
            return reject(new Error('Email sudah terdaftar.'));
        }

        if (details.role === Role.USER) {
            const user: User = {
                id: `user-${Date.now()}`,
                email: details.email,
                name: details.name,
                phone: details.phone,
                role: Role.USER,
                hasLoggedIn: false,
            };
            setUsers(prev => [...prev, user]);
        } else { // PARTNER
            const restaurant: Restaurant = {
                id: `resto-${Date.now()}`,
                email: details.email,
                name: details.name,
                role: Role.PARTNER,
                rewardPoints: 0,
                address: "Alamat Baru (mohon lengkapi)",
                type: "Restoran",
                contact: details.phone,
                lat: -6.200,
                lng: 106.800,
                hasLoggedIn: false,
            };
            setRestaurants(prev => [...prev, restaurant]);
        }
        
        // User is not logged in automatically.
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('savefood_user');
  };
  
  const clearNewUserFlag = () => {
    setIsNewUser(false);
  };

  const updateRestaurantPoints = (restaurantId: string, points: number) => {
    setRestaurants(prev => prev.map(resto => 
        resto.id === restaurantId ? { ...resto, rewardPoints: resto.rewardPoints + points } : resto
    ));
  };
  
  const updateUserProfile = async (userId: string, role: Role, details: Partial<User | Restaurant>): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (role === Role.USER) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...details } as User : u));
            } else {
                setRestaurants(prev => prev.map(r => r.id === userId ? { ...r, ...details } as Restaurant : r));
            }
            
            if (currentUser && currentUser.id === userId) {
                const updatedUser = { ...currentUser, ...details };
                setCurrentUser(updatedUser as AuthenticatedUser);
                localStorage.setItem('savefood_user', JSON.stringify(updatedUser));
            }
            resolve();
        }, 300);
    });
  };

  const deleteUserProfile = async (userId: string, role: Role): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              if (role === Role.USER) {
                  setUsers(prev => prev.filter(u => u.id !== userId));
              } else {
                  setRestaurants(prev => prev.filter(r => r.id !== userId));
              }
              logout(); // Logout after deletion
              resolve();
          }, 300);
      });
  };


  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, isNewUser, login, register, logout, clearNewUserFlag, users, restaurants, updateRestaurantPoints, updateUserProfile, deleteUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};