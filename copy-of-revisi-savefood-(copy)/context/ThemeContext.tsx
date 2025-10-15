import React, { createContext, useState, useEffect, useCallback } from 'react';

// --- TRANSLATIONS ---
const translations: { [key: string]: { [key: string]: string | any } } = {
  en: {
    savefood: 'SaveFood',
    // FIX: Renamed 'welcome' to 'welcomeGreeting' to avoid duplicate key error.
    welcomeGreeting: 'Hello, {{name}}!',
    welcomeSubtitle: 'Ready to save some delicious food today?',
    searchPlaceholder: 'Search for food or restaurants...',
    grabItFast: "Grab It Fast!",
    allFood: 'All Food',
    free: 'Free',
    freeTag: 'FREE',
    rp: 'Rp',
    stock: 'Stock',
    portions: 'Portions',
    remaining: 'Remaining',
    pickupTimeLeft: 'Pickup time left',
    timeUp: 'Time Up',
    description: 'Description',
    price: 'Price',
    pickupLocation: 'Pickup Location',
    reserveNow: 'Reserve Now',
    reservationSuccessTitle: 'Reservation Successful!',
    reservationSuccessBody: 'Your food is waiting for you. Show the QR code or reservation code at the store to pick it up.',
    saveQrCode: 'Save QR Code',
    orShowCode: 'Or show this code to the cashier',
    orderDetails: 'Order Details',
    at: 'at',
    done: 'Done',
    partnerDashboard: 'Partner Dashboard',
    postNewFood: 'Post New Food',
    postNewFoodDesc: 'Share your surplus food and prevent waste.',
    manageReservations: 'Manage Reservations',
    manageReservationsDesc: 'View and confirm incoming food reservations.',
    reportsAnalytics: 'Reports & Analytics',
    reportsAnalyticsDesc: 'Track your impact and see your saved meals.',
    myReservationsTitle: 'My Reservations',
    activeReservations: 'Active Reservations',
    noActiveReservations: 'No active reservations',
    goSaveFood: 'Go save some food!',
    history: 'History',
    incompleteReservationInfo: 'Incomplete Reservation Info',
    incompleteReservationInfoDesc: 'This item or restaurant may no longer be available.',
    completed: 'Completed',
    active: 'Active',
    date: 'Date',
    codeLabel: 'Code',
    historyWillAppearHere: 'Your past reservations will appear here.',
    myProfile: 'My Profile',
    foodSaver: 'Food Saver',
    email: 'Email',
    phoneNumber: 'Phone Number',
    deleteProfile: 'Delete Profile',
    logout: 'Logout',
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    deleteProfileTitle: 'Delete Account',
    deleteProfileBody: 'Are you sure? This action is irreversible. All your data will be permanently deleted.',
    confirmDelete: 'Yes, Delete',
    registerSuccessAlert: "Registration successful! Please log in to continue.",
    "alert.profileUpdatedSuccess": "Profile updated successfully!",
    "alert.foodPostedSuccess": "Food posted successfully!",
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    landingSubtitle: 'Rescue delicious unsold food from your favorite stores.',
    loginOrRegister: 'Continue as...',
    iAmAUser: 'I am a User',
    userDescription: 'Find and rescue surplus food near you.',
    iAmAPartner: 'I am a Partner',
    partnerDescription: 'Join the movement, reduce waste, and gain customers.',
    login: 'Login',
    register: 'Register',
    back: 'Back',
    name: 'Name',
    restaurantName: 'Restaurant Name',
    emailAddress: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    passwordMinChars: 'Password must be at least 5 characters.',
    passwordOneUppercase: 'Password must contain one uppercase letter.',
    passwordOneLowercase: 'Password must contain one lowercase letter.',
    passwordOneNumber: 'Password must contain one number.',
    phoneInvalid: 'Phone number must be +62 followed by 11 digits.',
    emailOrPasswordWrong: 'Incorrect email or password.',
    emailTaken: 'This email is already registered.',
    forgotPasswordTitle: 'Feature Not Available',
    forgotPasswordBody: 'This is a demo application.\nPassword recovery is not implemented. Please use the credentials you registered with or create a new account.',
    iUnderstand: 'I Understand',
    noFoodFoundTitle: 'No Food Found',
    noFoodFoundSubtitle: 'Try adjusting your search or category filters.',
    surpriseMealTitle: 'This is a Surprise Meal!',
    surpriseMealBody: "The contents are a surprise, but it's guaranteed to be delicious. You'll get a mix of available items from the partner.",
    "error.onlyUsersCanReserve": "Only users can make reservations.",
    "error.foodUnavailable": "This food is no longer available.",
    "error.pickupTimeEnded": "The pickup time for this item has ended.",
    "error.onlyPartnersCanPost": "Only partners can post food items.",
    "error.invalidReservationCode": "Invalid or already completed reservation code.",
    partnerDashboardTitle: 'Welcome to your Dashboard',
    reportsAnalyticsTitle: 'Reports & Analytics',
    portionsSaved: 'Portions Saved',
    portionsSavedDesc: 'Total meals rescued by customers.',
    yourRewardPoints: 'Your Reward Points',
    rewardPointsDesc: 'Points earned from your contributions.',
    unclaimedItems: 'Unclaimed Items',
    unclaimedItemsDesc: 'Items that passed their pickup time and were not reserved.',
    transactionHistory: 'Transaction History',
    by: 'by',
    noTransactionHistory: 'No transactions have been completed yet.',
    partnerProfile: 'Partner Profile',
    contactNumber: 'Contact Number',
    address: 'Address',
    restaurantType: 'Restaurant Type',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    heavyMeal: 'Heavy Meal',
    bread: 'Bread',
    beverage: 'Beverage',
    cake: 'Cake',
    other: 'Other',
    foodImage: 'Food Image',
    uploadAFile: 'Upload a file',
    orDragAndDrop: 'or drag and drop',
    imageFileTypes: 'PNG, JPG, GIF up to 10MB',
    isSurpriseMeal: 'Surprise Meal',
    surpriseMealInfo: 'Automatically enabled if price is 0.',
    foodName: 'Food Name',
    generateWithAI: 'Generate with AI',
    generating: 'Generating...',
    openMap: 'Open Map',
    category: { '_': 'Category', all: 'All' },
    pickupTime: 'Pickup Time',
    availableUntil: 'Available Until',
    pickupUntil: 'Pickup before',
    hour: 'hour',
    hours: 'hours',
    custom: 'Custom',
    endOfDay: 'End of Day',
    pickupDeadline: 'Pickup Deadline',
    pickupTimeHelpText: "Determine how long this food is available for pickup. You know best when your food is still in great condition.",
    "alert.selectCustomTime": "Please select a custom pickup date and time.",
    "alert.pastTimeError": "The selected pickup time cannot be in the past.",
    qualityNotes: "Quality Notes (Optional)",
    qualityNotesPlaceholder: "E.g., Freshly baked, still warm, best consumed today...",
    originalPrice: 'Original Price (Rp)',
    discountedPrice: 'Discounted Price (Rp)',
    pickupAddress: 'Pickup Address',
    useCurrentAddress: 'Use profile address',
    postFood: 'Post Food',
    reservationDate: 'Reservation Date',
    verifyReservation: 'Verify Reservation',
    enterCode: 'Enter reservation code...',
    verify: 'Verify',
    searchReservations: 'Search by code, food, or user name...',
    noActiveReservationsFound: 'No Active Reservations Found',
    tryDifferentSearch: 'Try a different search term.',
    newReservationsAppearHere: 'New reservations will appear here.',
    "alert.verificationSuccess": 'Reservation completed successfully!',
    "alert.verificationError": 'Verification failed. Please check the code and try again.',
    home: 'Home',
    cart: 'Cart',
    wishlist: 'Wishlist',
    myWishlistTitle: 'My Wishlist',
    wishlistEmptyTitle: 'Your wishlist is empty',
    wishlistEmptySubtitle: 'Tap the heart on any food item to save it here.',
    pickupLocationOnMap: 'Pickup Location on Map',
    findOnMapInstructions: 'Right-click on Google Maps to get coordinates and paste them here. Open map <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="text-primary underline">here</a>.',
    myListings: 'My Food Listings',
    myListingsDesc: 'View all your active and past food posts.',
    myListingsTitle: 'My Food Listings',
    activeListings: 'Active Listings',
    pastListings: 'Past Listings',
    noFoodPosted: 'No Food Posted Yet',
    postYourFirstItem: 'Post your first surplus food item to see it here.',
    soldOut: 'Sold Out',
    scanQrCode: 'Scan QR',
    invalidQrCode: 'Invalid QR code scanned.',
    scanningTitle: 'Scan Reservation QR',
    scannerInstructions: "Point the camera at the customer's QR code.",
    cameraErrorTitle: 'Camera Error',
    cameraPermissionError: 'Camera permission is required. Please allow camera access in your browser settings.',
    pickupWithin: 'Pickup in',
    extendTime: 'Extend Time',
    retractListing: 'Retract Listing',
    "alert.retractConfirm": "Are you sure you want to retract this item? It will become unavailable for users.",
    extendTimeSuccess: "Pickup time extended by 1 hour.",
    retractSuccess: "Item has been retracted.",
    welcome: {
      user: {
        title: "Welcome to SaveFood!",
        subtitle: "Thank you for joining the movement to save food.",
        howTo: {
          title: "How to Use The App",
          find: { "title": "Find Food", "desc": "Search for discounted or free food around you." },
          reserve: { "title": "Reserve", "desc": "Book your food so you don't run out when you arrive." },
          pickup: { "title": "Pick Up & Enjoy", "desc": "Pick up your food at the location and give it a rating." }
        },
        tips: {
          title: "Tips",
          notifications: "Enable notifications for new food info.",
          distance: "Check the distance before making a reservation.",
          pickupTime: "Pick up according to the promised time."
        },
        button: "Start Exploring"
      },
      partner: {
        title: "Welcome, Our Partner!",
        subtitle: "Let's reduce food waste and help the community together.",
        howTo: {
          title: "How It Works",
          upload: { "title": "Upload Food", "desc": "Add surplus food with photos and details." },
          setTime: { "title": "Set Time", "desc": "You decide how long the food is available." },
          getPoints: { "title": "Get Points", "desc": "Collect points and level up for more benefits." }
        },
        benefits: {
          title: "Benefits of Joining",
          waste: "Reduce food waste and losses.",
          reputation: "Enhance your reputation as a caring brand.",
          customers: "Reach more customers.",
          recognition: "Get certificates and recognition."
        },
        button: "View My Dashboard"
      }
    }
  },
  id: {
    savefood: 'SaveFood',
    // FIX: Renamed 'welcome' to 'welcomeGreeting' to avoid duplicate key error.
    welcomeGreeting: 'Halo, {{name}}!',
    welcomeSubtitle: 'Siap menyelamatkan makanan lezat hari ini?',
    searchPlaceholder: 'Cari makanan atau restoran...',
    grabItFast: "Ambil Segera!",
    allFood: 'Semua Makanan',
    free: 'Gratis',
    freeTag: 'GRATIS',
    rp: 'Rp',
    stock: 'Stok',
    portions: 'Porsi',
    remaining: 'Tersisa',
    pickupTimeLeft: 'Sisa Waktu Pengambilan',
    timeUp: 'Waktu Habis',
    description: 'Deskripsi',
    price: 'Harga',
    pickupLocation: 'Lokasi Pengambilan',
    reserveNow: 'Pesan Sekarang',
    reservationSuccessTitle: 'Reservasi Berhasil!',
    reservationSuccessBody: 'Makananmu sudah menanti. Tunjukkan kode QR atau kode reservasi di toko untuk mengambilnya.',
    saveQrCode: 'Simpan Kode QR',
    orShowCode: 'Atau tunjukkan kode ini ke kasir',
    orderDetails: 'Detail Pesanan',
    at: 'di',
    done: 'Selesai',
    partnerDashboard: 'Dasbor Mitra',
    postNewFood: 'Posting Makanan Baru',
    postNewFoodDesc: 'Bagikan makanan berlebih Anda dan cegah pemborosan.',
    manageReservations: 'Kelola Reservasi',
    manageReservationsDesc: 'Lihat dan konfirmasi reservasi makanan yang masuk.',
    reportsAnalytics: 'Laporan & Analitik',
    reportsAnalyticsDesc: 'Lacak dampak Anda dan lihat makanan yang terselamatkan.',
    myReservationsTitle: 'Reservasi Saya',
    activeReservations: 'Reservasi Aktif',
    noActiveReservations: 'Tidak ada reservasi aktif',
    goSaveFood: 'Ayo selamatkan makanan!',
    history: 'Riwayat',
    incompleteReservationInfo: 'Info Reservasi Tidak Lengkap',
    incompleteReservationInfoDesc: 'Item atau restoran ini mungkin tidak lagi tersedia.',
    completed: 'Selesai',
    active: 'Aktif',
    date: 'Tanggal',
    codeLabel: 'Kode',
    historyWillAppearHere: 'Riwayat reservasi Anda akan muncul di sini.',
    myProfile: 'Profil Saya',
    foodSaver: 'Penyelamat Makanan',
    email: 'Email',
    phoneNumber: 'Nomor Telepon',
    deleteProfile: 'Hapus Akun',
    logout: 'Keluar',
    editProfile: 'Ubah Profil',
    fullName: 'Nama Lengkap',
    saveChanges: 'Simpan Perubahan',
    cancel: 'Batal',
    deleteProfileTitle: 'Hapus Akun',
    deleteProfileBody: 'Apakah Anda yakin? Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.',
    confirmDelete: 'Ya, Hapus',
    registerSuccessAlert: "Pendaftaran berhasil! Silakan masuk untuk melanjutkan.",
    "alert.profileUpdatedSuccess": "Profil berhasil diperbarui!",
    "alert.foodPostedSuccess": "Makanan berhasil diposting!",
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    language: 'Bahasa',
    landingSubtitle: 'Selamatkan makanan lezat yang tidak terjual dari toko favorit Anda.',
    loginOrRegister: 'Masuk sebagai...',
    iAmAUser: 'Saya Pengguna',
    userDescription: 'Temukan dan selamatkan makanan berlebih di dekat Anda.',
    iAmAPartner: 'Saya Mitra',
    partnerDescription: 'Bergabunglah, kurangi limbah, dan dapatkan pelanggan.',
    login: 'Masuk',
    register: 'Daftar',
    back: 'Kembali',
    name: 'Nama',
    restaurantName: 'Nama Restoran',
    emailAddress: 'Alamat Email',
    password: 'Kata Sandi',
    forgotPassword: 'Lupa kata sandi?',
    passwordMinChars: 'Kata sandi minimal 5 karakter.',
    passwordOneUppercase: 'Kata sandi harus mengandung satu huruf besar.',
    passwordOneLowercase: 'Kata sandi harus mengandung satu huruf kecil.',
    passwordOneNumber: 'Kata sandi harus mengandung satu angka.',
    phoneInvalid: 'Nomor telepon harus +62 diikuti 11 digit.',
    emailOrPasswordWrong: 'Email atau kata sandi salah.',
    emailTaken: 'Email ini sudah terdaftar.',
    forgotPasswordTitle: 'Fitur Tidak Tersedia',
    forgotPasswordBody: 'Ini adalah aplikasi demo.\nPemulihan kata sandi tidak diimplementasikan. Silakan gunakan kredensial yang Anda daftarkan atau buat akun baru.',
    iUnderstand: 'Saya Mengerti',
    noFoodFoundTitle: 'Makanan Tidak Ditemukan',
    noFoodFoundSubtitle: 'Coba sesuaikan pencarian atau filter kategori Anda.',
    surpriseMealTitle: 'Ini adalah Makanan Kejutan!',
    surpriseMealBody: "Isinya adalah kejutan, tapi dijamin enak. Anda akan mendapatkan campuran item yang tersedia dari mitra.",
    "error.onlyUsersCanReserve": "Hanya pengguna yang dapat melakukan reservasi.",
    "error.foodUnavailable": "Makanan ini sudah tidak tersedia.",
    "error.pickupTimeEnded": "Waktu pengambilan untuk item ini telah berakhir.",
    "error.onlyPartnersCanPost": "Hanya mitra yang dapat memposting makanan.",
    "error.invalidReservationCode": "Kode reservasi tidak valid atau sudah selesai.",
    partnerDashboardTitle: 'Selamat Datang di Dasbor Anda',
    reportsAnalyticsTitle: 'Laporan & Analitik',
    portionsSaved: 'Porsi Terselamatkan',
    portionsSavedDesc: 'Total makanan yang diselamatkan oleh pelanggan.',
    yourRewardPoints: 'Poin Hadiah Anda',
    rewardPointsDesc: 'Poin yang diperoleh dari kontribusi Anda.',
    unclaimedItems: 'Item Tidak Diambil',
    unclaimedItemsDesc: 'Item yang melewati waktu pengambilan dan tidak dipesan.',
    transactionHistory: 'Riwayat Transaksi',
    by: 'oleh',
    noTransactionHistory: 'Belum ada transaksi yang selesai.',
    partnerProfile: 'Profil Mitra',
    contactNumber: 'Nomor Kontak',
    address: 'Alamat',
    restaurantType: 'Jenis Restoran',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi',
    heavyMeal: 'Makanan Berat',
    bread: 'Roti',
    beverage: 'Minuman',
    cake: 'Kue',
    other: 'Lainnya',
    foodImage: 'Gambar Makanan',
    uploadAFile: 'Unggah file',
    orDragAndDrop: 'atau seret dan lepas',
    imageFileTypes: 'PNG, JPG, GIF hingga 10MB',
    isSurpriseMeal: 'Makanan Kejutan',
    surpriseMealInfo: 'Otomatis aktif jika harga Rp 0.',
    foodName: 'Nama Makanan',
    generateWithAI: 'Buat dengan AI',
    generating: 'Membuat...',
    openMap: 'Buka Peta',
    category: { '_': 'Kategori', all: 'Semua' },
    pickupTime: 'Waktu Pengambilan',
    availableUntil: 'Tersedia Hingga',
    pickupUntil: 'Ambil sebelum',
    hour: 'jam',
    hours: 'jam',
    custom: 'Kustom',
    endOfDay: 'Akhir Hari',
    pickupDeadline: 'Batas Waktu Pengambilan',
    pickupTimeHelpText: "Tentukan hingga kapan makanan ini tersedia untuk diambil. Anda yang paling tahu kapan makanan ini masih dalam kondisi terbaik.",
    "alert.selectCustomTime": "Silakan pilih tanggal dan waktu pengambilan kustom.",
    "alert.pastTimeError": "Waktu pengambilan yang dipilih tidak boleh di masa lalu.",
    qualityNotes: "Catatan Kualitas (Opsional)",
    qualityNotesPlaceholder: "Contoh: Baru matang, kondisi masih sangat baik...",
    originalPrice: 'Harga Asli (Rp)',
    discountedPrice: 'Harga Diskon (Rp)',
    pickupAddress: 'Alamat Pengambilan',
    useCurrentAddress: 'Gunakan alamat profil',
    postFood: 'Posting Makanan',
    reservationDate: 'Tanggal Reservasi',
    verifyReservation: 'Verifikasi Reservasi',
    enterCode: 'Masukkan kode reservasi...',
    verify: 'Verifikasi',
    searchReservations: 'Cari berdasarkan kode, makanan, atau nama...',
    noActiveReservationsFound: 'Tidak Ada Reservasi Aktif',
    tryDifferentSearch: 'Coba kata kunci pencarian yang berbeda.',
    newReservationsAppearHere: 'Reservasi baru akan muncul di sini.',
    "alert.verificationSuccess": 'Reservasi berhasil diselesaikan!',
    "alert.verificationError": 'Verifikasi gagal. Periksa kembali kode dan coba lagi.',
    home: 'Beranda',
    cart: 'Keranjang',
    wishlist: 'Daftar Suka',
    myWishlistTitle: 'Daftar Suka Saya',
    wishlistEmptyTitle: 'Daftar suka Anda kosong',
    wishlistEmptySubtitle: 'Ketuk ikon hati pada makanan mana pun untuk menyimpannya di sini.',
    pickupLocationOnMap: 'Lokasi Pengambilan di Peta',
    findOnMapInstructions: 'Klik kanan di Google Maps untuk mendapatkan koordinat dan salin di sini. Buka peta <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="text-primary underline">di sini</a>.',
    myListings: 'Daftar Makanan Saya',
    myListingsDesc: 'Lihat semua postingan makanan aktif dan lampau Anda.',
    myListingsTitle: 'Daftar Makanan Saya',
    activeListings: 'Postingan Aktif',
    pastListings: 'Postingan Lampau',
    noFoodPosted: 'Belum Ada Makanan yang Diposting',
    postYourFirstItem: 'Posting makanan berlebih pertama Anda untuk melihatnya di sini.',
    soldOut: 'Habis Terjual',
    scanQrCode: 'Pindai QR',
    invalidQrCode: 'Kode QR yang dipindai tidak valid.',
    scanningTitle: 'Pindai QR Reservasi',
    scannerInstructions: 'Arahkan kamera ke kode QR pelanggan.',
    cameraErrorTitle: 'Kesalahan Kamera',
    cameraPermissionError: 'Izin kamera diperlukan. Mohon izinkan akses kamera di pengaturan browser Anda.',
    pickupWithin: 'Ambil dalam',
    extendTime: 'Perpanjang Waktu',
    retractListing: 'Tarik Postingan',
    "alert.retractConfirm": "Anda yakin ingin menarik item ini? Ini akan menjadi tidak tersedia untuk pengguna.",
    extendTimeSuccess: "Waktu pengambilan diperpanjang 1 jam.",
    retractSuccess: "Item telah ditarik dari daftar.",
    welcome: {
      user: {
        title: "Selamat Datang di SaveFood!",
        subtitle: "Terima kasih telah bergabung dalam gerakan menyelamatkan makanan.",
        howTo: {
          title: "Cara Menggunakan Aplikasi",
          find: { "title": "Temukan Makanan", "desc": "Cari makanan dengan harga diskon atau gratis di sekitar Anda." },
          reserve: { "title": "Reservasi", "desc": "Pesan makanan agar tidak kehabisan saat Anda datang." },
          pickup: { "title": "Ambil & Nikmati", "desc": "Ambil makanan di lokasi dan berikan rating." }
        },
        tips: {
          title: "Tips",
          notifications: "Aktifkan notifikasi untuk info makanan baru.",
          distance: "Periksa jarak sebelum reservasi.",
          pickupTime: "Ambil sesuai waktu yang dijanjikan."
        },
        button: "Mulai Jelajahi"
      },
      partner: {
        title: "Selamat Datang, Mitra Kami!",
        subtitle: "Mari bersama mengurangi food waste dan membantu masyarakat.",
        howTo: {
          title: "Cara Kerja",
          upload: { "title": "Upload Makanan", "desc": "Tambahkan makanan berlebih dengan foto dan detail." },
          setTime: { "title": "Tentukan Waktu", "desc": "Anda yang menentukan hingga kapan makanan tersedia." },
          getPoints: { "title": "Dapatkan Poin", "desc": "Kumpulkan poin dan naik tier untuk benefit lebih." }
        },
        benefits: {
          title: "Benefit Bergabung",
          waste: "Kurangi food waste dan kerugian.",
          reputation: "Tingkatkan reputasi sebagai brand yang peduli.",
          customers: "Jangkau lebih banyak customer.",
          recognition: "Dapatkan sertifikat dan recognition."
        },
        button: "Lihat Dashboard Saya"
      }
    }
  },
};


// --- THEME CONTEXT ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('savefood_theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('savefood_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- LANGUAGE CONTEXT ---
type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

    useEffect(() => {
        const storedLang = localStorage.getItem('savefood_lang') as Language | null;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('savefood_lang', lang);
    };
    
    const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
        let translation = translations[language];
        const keyParts = key.split('.');
        let text: any = translation;

        for (const part of keyParts) {
            if (text && typeof text === 'object' && part in text) {
                text = text[part];
            } else {
                // Fallback to English if key not found in current language
                text = keyParts.reduce((acc: any, p) => acc && acc[p], translations['en']);
                if (text === undefined) return key; // return key if not found in English either
                break;
            }
        }
        
        if (typeof text === 'object' && text !== null && '_' in text) {
            text = text['_'];
        }

        if (typeof text !== 'string') {
            return key;
        }

        if (options) {
            Object.keys(options).forEach(optKey => {
                text = text.replace(new RegExp(`{{${optKey}}}`, 'g'), String(options[optKey]));
            });
        }
        
        return text;
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};