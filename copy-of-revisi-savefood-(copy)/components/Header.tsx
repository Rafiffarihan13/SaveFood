import React, { useContext } from 'react';
import { Leaf, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Role } from '../types';


interface HeaderProps {
    title: string;
    variant?: 'primary' | 'light';
    onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, variant = 'primary', onProfileClick }) => {
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext || {};

  const isPrimary = variant === 'primary';
  const showProfileIcon = currentUser && onProfileClick;

  const bgColor = isPrimary ? 'bg-primary text-white' : 'bg-white text-dark border-b dark:bg-gray-800 dark:text-light dark:border-gray-700';
  const logoColor = isPrimary ? '' : 'text-primary';
  const hoverBg = isPrimary ? 'hover:bg-primary-dark' : 'hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <header className={`${bgColor} shadow-sm p-4 flex justify-between items-center sticky top-0 z-40`}>
      <div className="flex items-center gap-2">
        <Leaf size={28} className={logoColor} />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {showProfileIcon && (
        <button onClick={onProfileClick} className={`p-2 rounded-full ${hoverBg} transition-colors`}>
            <User size={22} />
        </button>
      )}
    </header>
  );
};

export default Header;