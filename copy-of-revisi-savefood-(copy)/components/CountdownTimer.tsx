import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/ThemeContext';

interface CountdownTimerProps {
  availableUntil: Date;
  onExpire: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ availableUntil, onExpire }) => {
  const [display, setDisplay] = useState({ text: '', colorClass: 'text-green-500' });
  const { t } = useContext(LanguageContext)!;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(availableUntil) - +new Date();
      let newDisplay = { text: '', colorClass: 'text-green-500' };

      if (difference > 0) {
        const totalHours = difference / (1000 * 60 * 60);
        const hours = Math.floor(totalHours);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        
        if (hours > 0) {
            newDisplay.text = `${t('pickupWithin')} ${hours}h ${minutes}m`;
        } else {
            const seconds = Math.floor((difference / 1000) % 60);
            newDisplay.text = `${t('pickupWithin')} ${minutes}m ${seconds}s`;
        }

        if (totalHours < 1) {
          newDisplay.colorClass = 'text-red-500';
        } else if (totalHours < 2) {
          newDisplay.colorClass = 'text-yellow-500';
        }

      } else {
        newDisplay.text = t('timeUp');
        newDisplay.colorClass = 'text-red-500';
        onExpire();
      }
      return newDisplay;
    };

    const timer = setInterval(() => {
      setDisplay(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setDisplay(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [availableUntil, onExpire, t]);

  return (
    <span className={`font-mono font-bold ${display.colorClass}`}>
      {display.text}
    </span>
  );
};

export default CountdownTimer;