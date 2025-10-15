import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Role } from '../types';
import { ChevronLeft, LogIn, UserPlus, AlertTriangle, Loader2, X, HelpCircle, Eye, EyeOff } from 'lucide-react';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';

interface AuthPageProps {
  mode: 'login' | 'register';
  role: Role;
  onBack: () => void;
}

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useContext(LanguageContext)!;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark rounded-lg shadow-xl w-full max-w-sm relative p-6 text-center animate-fade-in-up">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-dark dark:hover:text-light">
                    <X size={24} />
                </button>
                <HelpCircle className="text-primary mx-auto mb-4" size={48} />
                <h2 className="text-xl font-bold text-dark dark:text-light">{t('forgotPasswordTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm"
                   dangerouslySetInnerHTML={{ __html: t('forgotPasswordBody').replace(/\n/g, '<br/><br/>') }}
                />
                <button onClick={onClose} className="mt-6 w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                  {t('iUnderstand')}
                </button>
            </div>
        </div>
    );
};


const AuthPage: React.FC<AuthPageProps> = ({ mode, role, onBack }) => {
  const authContext = useContext(AuthContext);
  const { t } = useContext(LanguageContext)!;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    password: '',
    form: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 5) return t('passwordMinChars');
    if (!/[A-Z]/.test(password)) return t('passwordOneUppercase');
    if (!/[a-z]/.test(password)) return t('passwordOneLowercase');
    if (!/\d/.test(password)) return t('passwordOneNumber');
    return "";
  };
  
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+62\d{11}$/; // +62 followed by 11 digits
    if (!phoneRegex.test(phone)) return t('phoneInvalid');
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'password':
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        break;
      case 'phone':
        setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
        const numericValue = value.replace(/\D/g, ''); // only allow numbers
        const fullPhone = `+62${numericValue}`;
        setFormData(prev => ({ ...prev, phone: fullPhone }));
        if (mode === 'register') {
            validateField(name, fullPhone);
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (mode === 'register') {
            validateField(name, value);
        }
    }
  };
  
  const isFormValid = useMemo(() => {
    if (mode === 'login') {
        return formData.email && formData.password;
    }
    return (
        formData.name &&
        formData.phone &&
        formData.email &&
        formData.password &&
        !errors.phone &&
        !errors.password
    );
  }, [formData, errors, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({...prev, form: ''}));
    
    if (mode === 'register' && !isFormValid) {
        // Trigger all validations on submit attempt
        validateField('password', formData.password);
        validateField('phone', formData.phone);
        return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await authContext?.login(formData.email, formData.password, role);
      } else {
        await authContext?.register({ ...formData, role });
        alert(t('registerSuccessAlert'));
        onBack();
      }
    } catch (err: any) {
      const message = err.message === 'Email atau password salah.' ? t('emailOrPasswordWrong')
                    : err.message === 'Email sudah terdaftar.' ? t('emailTaken')
                    : err.message;
      setErrors(prev => ({...prev, form: message}));
    } finally {
        setIsLoading(false);
    }
  };
  
  const title = t(mode);
  const roleText = t(role === 'USER' ? 'user' : 'partner');
  
  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-500 text-white font-bold text-sm py-2 px-3 rounded-md mt-2 flex items-center gap-2">
      <AlertTriangle size={16} />
      <span>{message}</span>
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-light dark:bg-slate-900 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold mb-4">
                <ChevronLeft size={20} /> {t('back')}
            </button>
            <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-md dark:border dark:border-slate-700">
                <h1 className="text-3xl font-bold text-center text-dark dark:text-light">{title} sebagai {roleText}</h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {mode === 'register' && (
                    <>
                    <div>
                        <label htmlFor="name" className="sr-only">{t('name')}</label>
                        <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder={t(role === 'USER' ? 'fullName' : 'restaurantName')} />
                    </div>
                    <div>
                        <label htmlFor="phone" className="sr-only">{t('phoneNumber')}</label>
                        <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden dark:border-slate-600 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                            <span className="px-3 text-gray-500 bg-gray-50 dark:bg-dark border-r border-gray-300 dark:border-slate-600 self-stretch flex items-center">+62</span>
                            <input 
                                id="phone" 
                                name="phone" 
                                type="tel" 
                                autoComplete="tel"
                                required 
                                value={formData.phone.startsWith('+62') ? formData.phone.substring(3) : formData.phone} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 border-0 rounded-r-md focus:ring-0 dark:bg-slate-700 dark:text-white" 
                                placeholder="81234567890"
                                maxLength={11}
                            />
                        </div>
                        {errors.phone && <ErrorMessage message={errors.phone} />}
                    </div>
                    </>
                )}
                <div>
                    <label htmlFor="email-address" className="sr-only">{t('emailAddress')}</label>
                    <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder={t('emailAddress')} />
                </div>
                <div className="relative">
                    <label htmlFor="password" className="sr-only">{t('password')}</label>
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10" placeholder={t('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400" aria-label={t(showPassword ? 'hidePassword' : 'showPassword')}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {mode === 'register' && errors.password && <ErrorMessage message={errors.password} />}

                {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}

                <div>
                    <button type="submit" disabled={!isFormValid || isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                       <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20}/>}
                        </span>
                        {title}
                       </>
                    )}
                    </button>
                </div>
                </form>

                {mode === 'login' && (
                    <div className="text-center mt-4">
                        <button 
                            onClick={() => setShowForgotPasswordModal(true)}
                            className="text-sm font-medium text-primary hover:text-primary-dark dark:text-green-400 dark:hover:text-green-300"
                        >
                            {t('forgotPassword')}
                        </button>
                    </div>
                )}
            </div>
       </div>
    </div>
    {showForgotPasswordModal && <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />}
    </>
  );
};

export default AuthPage;