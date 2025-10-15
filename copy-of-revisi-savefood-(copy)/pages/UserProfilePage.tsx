import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, LogOut, ChevronLeft, Edit, Trash2, Heart, ChevronRight } from 'lucide-react';
import ThemeToggle, { LanguageSwitcher } from '../components/ThemeToggle';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';

const ProfileItem: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-dark dark:text-light">{value}</p>
        </div>
    </div>
);

interface UserProfilePageProps {
    onBack: () => void;
    onNavigateToWishlist: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onBack, onNavigateToWishlist }) => {
    const authContext = useContext(AuthContext);
    const { t } = useContext(LanguageContext)!;

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (authContext?.currentUser) {
            setFormData({
                name: authContext.currentUser.name,
                phone: (authContext.currentUser as any).phone || ''
            });
            setImagePreview(authContext.currentUser.avatarUrl || null);
        }
    }, [authContext?.currentUser]);
    
    if (!authContext || !authContext.currentUser) {
        return null;
    }

    const { currentUser, logout, updateUserProfile, deleteUserProfile } = authContext;

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async () => {
        if (formData.name) {
            let detailsToUpdate: any = { ...formData };
            if (imageFile) {
                const avatarUrl = await fileToDataUrl(imageFile);
                detailsToUpdate.avatarUrl = avatarUrl;
            }
            await updateUserProfile(currentUser.id, currentUser.role, detailsToUpdate);
            setIsEditing(false);
            setImageFile(null); // Reset file state
            alert(t('alert.profileUpdatedSuccess'));
        }
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(currentUser.avatarUrl || null); // Reset to original
    };

    const handleDeleteProfile = async () => {
        await deleteUserProfile(currentUser.id, currentUser.role);
        // User will be logged out, no need to close modal
    };

    return (
        <div className="h-full flex flex-col">
            <header className="bg-primary text-white shadow-sm p-4 flex items-center sticky top-0 z-40 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-primary-dark transition-colors">
                    <ChevronLeft />
                </button>
                <h1 className="text-xl font-bold">{t('myProfile')}</h1>
            </header>
            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                    <div className="p-6 bg-white rounded-xl shadow-sm flex items-center gap-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {currentUser.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                <User size={32} className="text-primary"/>
                            </div>
                        )}
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-dark dark:text-light">{currentUser.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300">{t('foodSaver')}</p>
                        </div>
                         <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-primary">
                            <Edit size={20} />
                        </button>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm space-y-6 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <ProfileItem icon={<Mail size={24} />} label={t('email')} value={currentUser.email} />
                        <ProfileItem icon={<Phone size={24} />} label={t('phoneNumber')} value={(currentUser as any).phone || '-'} />
                    </div>

                    <div className="p-4 bg-white rounded-xl shadow-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button onClick={onNavigateToWishlist} className="w-full flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 -m-4 p-4 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-primary"><Heart size={24} /></div>
                                <div>
                                    <p className="font-semibold text-dark dark:text-light">{t('myWishlistTitle')}</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => setIsDeleting(true)}
                            className="w-full flex items-center justify-center gap-2 bg-transparent text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-500">
                            <Trash2 size={20}/>
                            <span>{t('deleteProfile')}</span>
                        </button>
                        <button 
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                            <LogOut size={20}/>
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4 flex-shrink-0">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
            </div>
            
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-xl w-full max-w-sm relative animate-fade-in-up">
                        <h2 className="text-xl font-bold text-dark dark:text-light mb-4">{t('editProfile')}</h2>
                        <div className="space-y-4">
                             <div className="flex flex-col items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/png, image/jpeg"
                                />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-full group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover"/>
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <User size={40} className="text-gray-500"/>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit size={24} className="text-white"/>
                                    </div>
                                </button>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullName')}</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phoneNumber')}</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleFormChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-dark font-semibold py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-light dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={handleUpdateProfile} className="flex-1 bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary-dark">{t('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleting && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-xl w-full max-w-sm relative animate-fade-in-up text-center">
                        <h2 className="text-xl font-bold text-dark dark:text-light">{t('deleteProfileTitle')}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{t('deleteProfileBody')}</p>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setIsDeleting(false)} className="flex-1 bg-gray-200 text-dark font-semibold py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-light dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={handleDeleteProfile} className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700">{t('confirmDelete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;