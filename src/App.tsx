import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  Zap, 
  Car, 
  MapPin, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  HelpCircle, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Bell,
  Ticket,
  Calendar,
  Clock,
  User,
  Phone,
  Check
} from 'lucide-react';
import { ServiceType, FleetState, Booking, Language, AppNotification, PaymentMethod, TourPackage } from './types';
import { 
  INITIAL_FLEET_STATE, 
  INITIAL_BOOKINGS_STORAGE_KEY, 
  FLEET_STORAGE_KEY,
  GILI_POPULAR_LOCATIONS,
  LOMBOK_TIMUR_TOURS
} from './data/constants';
import { translations } from './i18n/translations';
import { LanguageToggle } from './components/LanguageToggle';
import { NotificationCenter } from './components/NotificationCenter';
import { PaymentModal } from './components/PaymentModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminManageModal } from './components/AdminManageModal';
import { InfoRouteModal } from './components/InfoRouteModal';
import { CustomerServiceChat } from './components/CustomerServiceChat';
import { ItegoLogo } from './components/ItegoLogo';
import { formatRupiah } from './utils/formatters';

const NOTIFICATIONS_STORAGE_KEY = 'itego_notifications_v1';
const LANGUAGE_STORAGE_KEY = 'itego_language_v1';

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (savedLang === 'id' || savedLang === 'en') return savedLang;
    } catch (e) {
      console.error(e);
    }
    return 'id';
  });

  const t = translations[language];

  // Active navigation view
  const [activeTab, setActiveTab] = useState<'booking' | 'my-orders' | 'info'>('booking');

  // Currently chosen service: 'rental_sepeda' | 'ojek_listrik' | 'driver_mobil'
  const [selectedService, setSelectedService] = useState<ServiceType>('rental_sepeda');

  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // Service 1: Rental Sepeda state
  const [bikeCount, setBikeCount] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  const [bikePickupDate, setBikePickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bikePickupTime, setBikePickupTime] = useState('09:00');
  const [bikeLocation, setBikeLocation] = useState(GILI_POPULAR_LOCATIONS[0]);

  // Service 2: Ojek Sepeda Listrik state
  const [ojekPickup, setOjekPickup] = useState(GILI_POPULAR_LOCATIONS[0]);
  const [ojekDrop, setOjekDrop] = useState(GILI_POPULAR_LOCATIONS[1]);
  const [ojekTiming, setOjekTiming] = useState<'sekarang' | 'jadwal'>('sekarang');
  const [ojekScheduledTime, setOjekScheduledTime] = useState('14:00');

  // Service 3: Driver Mobil Bangsal -> Lombok Timur state
  const [selectedTour, setSelectedTour] = useState<TourPackage>(LOMBOK_TIMUR_TOURS[0]);
  const [carDate, setCarDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [carTime, setCarTime] = useState('09:30');
  const [passengerCount, setPassengerCount] = useState(2);
  const [boatInfo, setBoatInfo] = useState('');
  const [customDestination, setCustomDestination] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotifs) return JSON.parse(savedNotifs);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'notif-1',
        title: 'Armada Siap Melayani',
        message: '10 unit sepeda kayuh & 1 ojek listrik di Gili Trawangan serta 1 mobil driver di Pelabuhan Bangsal siap digunakan.',
        type: 'fleet',
        isRead: false,
        timestamp: 'Hari ini',
      },
      {
        id: 'notif-2',
        title: 'Pembayaran QRIS & Tunai Tersedia',
        message: 'Nikmati kemudahan bayar di tempat (COD) atau scan instan via QRIS Nasional.',
        type: 'promo',
        isRead: false,
        timestamp: 'Kemarin',
      },
    ];
  });

  // Floating Toast Alert
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setActiveToast({ title, message });
    setTimeout(() => setActiveToast(null), 4000);
  };

  // Fleet state persistent in localStorage
  const [fleet, setFleet] = useState<FleetState>(() => {
    try {
      const saved = localStorage.getItem(FLEET_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FLEET_STATE;
  });

  // Bookings list persistent in localStorage
  const [orders, setOrders] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(INITIAL_BOOKINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ITG-2045',
        serviceType: 'rental_sepeda',
        customerName: 'Sarah Amanda',
        customerPhone: '081234567890',
        unitCount: 2,
        rentalDays: 1,
        pickupLocation: 'Pelabuhan Utama Gili Trawangan',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '09:00',
        unitPrice: 50000,
        totalPrice: 100000,
        paymentMethod: 'qris',
        paymentStatus: 'lunas',
        bookingStatus: 'terkonfirmasi',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Modals state
  const [bookingDraft, setBookingDraft] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [ticketModalBooking, setTicketModalBooking] = useState<Booking | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(fleet));
    } catch (e) {
      console.error(e);
    }
  }, [fleet]);

  useEffect(() => {
    try {
      localStorage.setItem(INITIAL_BOOKINGS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Calculate live total price
  const calculateTotal = (): number => {
    if (selectedService === 'rental_sepeda') {
      return bikeCount * rentalDays * fleet.bikePricePerDay;
    }
    if (selectedService === 'ojek_listrik') {
      return fleet.electricOjekPricePerTrip;
    }
    if (selectedService === 'driver_mobil') {
      return selectedTour.price;
    }
    return 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Perhatian', language === 'id' ? 'Mohon masukkan nama pemesan.' : 'Please enter your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      showToast('Perhatian', language === 'id' ? 'Mohon masukkan nomor WhatsApp / HP aktif.' : 'Please enter active WhatsApp number.');
      return;
    }

    let pickupFinal = '';
    let dropFinal = '';
    let pickupDate = '';
    let pickupTime = '';

    if (selectedService === 'rental_sepeda') {
      pickupFinal = bikeLocation;
      pickupDate = bikePickupDate;
      pickupTime = bikePickupTime;
    } else if (selectedService === 'ojek_listrik') {
      pickupFinal = ojekPickup;
      dropFinal = ojekDrop;
      pickupDate = new Date().toISOString().split('T')[0];
      pickupTime = ojekTiming === 'sekarang' ? 'Sekarang (Segera)' : ojekScheduledTime;
    } else if (selectedService === 'driver_mobil') {
      pickupFinal = 'Pelabuhan Bangsal';
      dropFinal = selectedTour.title + (customDestination ? ` (${customDestination})` : '');
      pickupDate = carDate;
      pickupTime = carTime;
    }

    const draft = {
      serviceType: selectedService,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerNote: customerNote.trim(),
      unitCount: selectedService === 'rental_sepeda' ? bikeCount : 1,
      rentalDays: selectedService === 'rental_sepeda' ? rentalDays : undefined,
      pickupLocation: pickupFinal,
      dropLocation: dropFinal,
      pickupDate,
      pickupTime,
      destinationPackage: selectedService === 'driver_mobil' ? selectedTour.id : undefined,
      destinationName: selectedService === 'driver_mobil' ? selectedTour.title : undefined,
      passengerCount: selectedService === 'driver_mobil' ? passengerCount : undefined,
      flightOrBoatInfo: boatInfo.trim() || undefined,
      unitPrice: selectedService === 'rental_sepeda' ? fleet.bikePricePerDay : selectedService === 'ojek_listrik' ? fleet.electricOjekPricePerTrip : selectedTour.price,
      totalPrice: calculateTotal(),
      paymentMethod,
    };

    setBookingDraft(draft);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmBooking = (finalBooking: Booking) => {
    if (finalBooking.serviceType === 'rental_sepeda') {
      setFleet((prev) => ({
        ...prev,
        availableBikes: Math.max(0, prev.availableBikes - finalBooking.unitCount),
      }));
    }

    setOrders((prev) => [finalBooking, ...prev]);
    setIsPaymentModalOpen(false);
    setBookingDraft(null);
    setTicketModalBooking(finalBooking);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: language === 'id' ? `Pesanan #${finalBooking.id} Berhasil!` : `Booking #${finalBooking.id} Confirmed!`,
      message: language === 'id' 
        ? `Tiket Anda telah aktif. Hubungi driver via WhatsApp untuk konfirmasi penjemputan.`
        : `Your digital ticket is ready. Chat driver on WhatsApp for instant confirmation.`,
      type: 'order',
      isRead: false,
      timestamp: language === 'id' ? 'Baru saja' : 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      language === 'id' ? 'Pesanan Berhasil Dibuat!' : 'Booking Created Successfully!',
      language === 'id' ? `Tiket #${finalBooking.id} siap digunakan.` : `Ticket #${finalBooking.id} is active.`
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === bookingId) {
          if (ord.serviceType === 'rental_sepeda') {
            setFleet((f) => ({
              ...f,
              availableBikes: Math.min(f.totalBikes, f.availableBikes + ord.unitCount),
            }));
          }
          return { ...ord, bookingStatus: 'dibatalkan' };
        }
        return ord;
      })
    );

    showToast(
      language === 'id' ? 'Pesanan Dibatalkan' : 'Booking Cancelled',
      language === 'id' ? `Tiket #${bookingId} telah dibatalkan.` : `Ticket #${bookingId} has been cancelled.`
    );
  };

  const activeOrdersCount = orders.filter(
    (o) => o.bookingStatus !== 'selesai' && o.bookingStatus !== 'dibatalkan'
  ).length;

  return (
    <div className="bg-[#F4F4F4] text-[#000000] font-sans selection:bg-[#00AA13] selection:text-white antialiased min-h-screen lg:h-screen lg:overflow-hidden flex flex-col">
      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-black text-white p-4 rounded-2xl border border-gray-800 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-[#00AA13] text-white flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-[#00AA13]">{activeToast.title}</p>
            <p className="text-xs text-gray-300 mt-0.5">{activeToast.message}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-gray-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* MOBILE TOP BAR (< 1024px) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div 
          onClick={() => setActiveTab('booking')}
          className="flex items-center cursor-pointer"
        >
          <ItegoLogo size="sm" showSubtitle={true} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20">
            <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
          <NotificationCenter
            notifications={notifications}
            setNotifications={setNotifications}
            language={language}
            onOpenTicket={() => setActiveTab('my-orders')}
          />
        </div>
      </div>

      {/* 3-PANEL COMMAND DASHBOARD MATCHING VARIATION 16 (GOJEK INSPIRED) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] overflow-hidden">
        
        {/* PANEL 1: SIDEBAR NAVIGATION (260px) */}
        <nav className="border-r border-gray-200 p-6 sm:p-7 flex flex-col justify-between hidden lg:flex bg-[#FAFAFA] h-full overflow-y-auto">
          <div>
            {/* Logo Wrap */}
            <div 
              onClick={() => setActiveTab('booking')}
              className="cursor-pointer group select-none block"
            >
              <ItegoLogo size="md" showSubtitle={true} />
            </div>

            {/* Nav Links */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedService('rental_sepeda');
                  setActiveTab('booking');
                }}
                className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'booking' && selectedService === 'rental_sepeda'
                    ? 'bg-[#E8F5E9] text-[#00AA13] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Bike className="w-4 h-4 text-[#00AA13]" />
                <span>{language === 'id' ? 'Rental Sepeda (10 Unit)' : 'Bicycle Rental (10 Units)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService('ojek_listrik');
                  setActiveTab('booking');
                }}
                className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'booking' && selectedService === 'ojek_listrik'
                    ? 'bg-[#E8F5E9] text-[#00AA13] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Zap className="w-4 h-4 text-[#00AA13] fill-current" />
                <span>{language === 'id' ? 'Ojek Listrik (1 Unit)' : 'E-Bike Taxi (1 Unit)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService('driver_mobil');
                  setActiveTab('booking');
                }}
                className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'booking' && selectedService === 'driver_mobil'
                    ? 'bg-[#E8F5E9] text-[#00AA13] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Car className="w-4 h-4 text-[#00AA13]" />
                <span>{language === 'id' ? 'Mobil Driver (Bangsal)' : 'Car Driver (Bangsal)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-orders')}
                className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'my-orders'
                    ? 'bg-[#E8F5E9] text-[#00AA13] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Ticket className="w-4 h-4 text-[#00AA13]" />
                <span>{t.navTickets}</span>
                {activeOrdersCount > 0 && (
                  <span className="bg-[#00AA13] text-white font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ml-auto">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-[#E8F5E9] text-[#00AA13] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#00AA13]" />
                <span>{t.navGuide}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 text-gray-500 hover:bg-gray-100 hover:text-black transition-all cursor-pointer mt-2 border border-dashed border-gray-300"
              >
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                <span>{t.navPartner} Panel</span>
              </button>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="label-v16">v2.0.4.6 Official</span>
              <NotificationCenter
                notifications={notifications}
                setNotifications={setNotifications}
                language={language}
                onOpenTicket={() => setActiveTab('my-orders')}
              />
            </div>
            <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </nav>

        {/* PANEL 2: CENTER MAIN CONTENT (1fr) */}
        <main className="p-6 sm:p-10 overflow-y-auto border-r border-gray-200 bg-[#FFFFFF]">
          {activeTab === 'booking' && (
            <div>
              {/* Status Badge */}
              <div className="status-pill-v16 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00AA13] animate-pulse"></span>
                <span>● Available for Booking ({fleet.availableBikes}/{fleet.totalBikes} {language === 'id' ? 'Sepeda Standby' : 'Bikes Ready'})</span>
              </div>

              {/* Hero Title */}
              <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#000000] tracking-tight mb-2 leading-tight">
                Eksplorasi<br />
                <span className="text-[#00AA13]">Tanpa Batas.</span>
              </h1>

              {/* Description */}
              <p className="hero-desc text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed mb-7">
                {language === 'id' 
                  ? 'Layanan transportasi terpadu untuk wilayah Gili Trawangan dan Lombok Timur. Sewa sepeda harian, ojek listrik cepat, hingga layanan driver mobil profesional dari Pelabuhan Bangsal.'
                  : 'Integrated transport service for Gili Trawangan and East Lombok. Daily bicycle rentals, speedy electric bike taxis, and private car drivers from Bangsal Port.'}
              </p>

              {/* 3 Interactive Service Cards matching Variation 16 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                {/* 1. Sepeda Kayuh */}
                <div
                  onClick={() => setSelectedService('rental_sepeda')}
                  className={`service-card-v16 cursor-pointer relative ${
                    selectedService === 'rental_sepeda' ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="label-v16">{language === 'id' ? 'Rental Harian' : 'Daily Rental'}</span>
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center">
                      <Bike className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-extrabold text-lg text-black">
                    {language === 'id' ? 'Sepeda Kayuh' : 'Pedal Bicycle'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {language === 'id' ? 'Unit standar pulau dengan keranjang depan & gembok pengaman.' : 'Standard island bicycles with basket & safety padlock.'}
                  </p>
                  <div className="price text-xl font-extrabold text-[#00AA13] mt-4 flex items-baseline gap-1">
                    Rp 50.000 <span className="text-xs text-gray-500 font-normal">/ Hari</span>
                  </div>
                </div>

                {/* 2. Ojek Listrik */}
                <div
                  onClick={() => setSelectedService('ojek_listrik')}
                  className={`service-card-v16 cursor-pointer relative ${
                    selectedService === 'ojek_listrik' ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="label-v16">{language === 'id' ? 'Sekali Jalan' : 'One-way Trip'}</span>
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <h3 className="font-extrabold text-lg text-black">
                    {language === 'id' ? 'Ojek Sepeda Listrik' : 'Electric Bike Taxi'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {language === 'id' ? 'Transportasi cepat, bebas capek, legal melintasi area Gili Trawangan.' : 'Speedy island transit across Gili Trawangan.'}
                  </p>
                  <div className="price text-xl font-extrabold text-[#00AA13] mt-4 flex items-baseline gap-1">
                    Rp 20.000 <span className="text-xs text-gray-500 font-normal">/ Trip</span>
                  </div>
                </div>

                {/* 3. Driver Mobil Bangsal */}
                <div
                  onClick={() => setSelectedService('driver_mobil')}
                  className={`service-card-v16 cursor-pointer sm:col-span-2 relative ${
                    selectedService === 'driver_mobil' ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="label-v16">{language === 'id' ? 'Penjemputan Pelabuhan' : 'Port Arrival Pickup'}</span>
                        <span className="bg-[#E8F5E9] text-[#00AA13] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Toyota Avanza AC
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-black">
                        {language === 'id' ? 'Driver Mobil Bangsal ➡️ Lombok Timur' : 'Private Car & Driver (Bangsal)'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
                        {language === 'id' ? 'Pelabuhan Bangsal ke Sembalun, Tetebatu, Pantai Pink, Korleko, atau Trip Harian Request.' : 'Bangsal Port to Sembalun, Tetebatu, Pink Beach, Korleko, or Custom Day Tour.'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-[#00AA13] block">
                        {selectedTour.title}
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        {formatRupiah(selectedTour.price)}
                      </span>
                    </div>
                  </div>

                  {/* Tour List Selector when Mobil Driver is chosen */}
                  {selectedService === 'driver_mobil' && (
                    <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
                      <div className="label-v16">{language === 'id' ? 'Pilih Destinasi Wisata Lombok Timur:' : 'Select East Lombok Tour:'}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {LOMBOK_TIMUR_TOURS.map((tour) => {
                          const isSel = selectedTour.id === tour.id;
                          return (
                            <div
                              key={tour.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTour(tour);
                              }}
                              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                isSel
                                  ? 'bg-[#E8F5E9] border-[#00AA13] text-black shadow-xs'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex justify-between items-center font-bold">
                                <span>{tour.title}</span>
                                <span className="text-[#00AA13] font-bold">{formatRupiah(tour.price)}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{tour.description}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom request route if custom-all-day */}
                      {selectedTour.id === 'custom-all-day' && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#E8F5E9]/50 border border-[#00AA13]/40">
                          <label className="block text-xs font-bold text-[#00AA13] mb-1">
                            {language === 'id' ? 'Tulis Rute atau Lokasi yang Ingin Direquest:' : 'Write custom destinations requested:'}
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Sembalun pagi, siang Tetebatu, sore Pantai Pink / Korleko..."
                            value={customDestination}
                            onChange={(e) => setCustomDestination(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-black text-xs p-2.5 rounded-lg focus:outline-none focus:border-[#00AA13]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Data Pemesan */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-7 shadow-xs">
                <div className="label-v16 mb-3">{t.formCustomerData}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1 font-bold">{t.formFullName} *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rian Pratama"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-gray-300 text-black text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#00AA13] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1 font-bold">{t.formPhone} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-gray-300 text-black text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#00AA13] transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs text-gray-700 mb-1 font-bold">{t.formNote}</label>
                  <input
                    type="text"
                    placeholder={t.formNotePlaceholder}
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-gray-300 text-black text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#00AA13] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY TICKETS VIEW */}
          {activeTab === 'my-orders' && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-xs">
              <div className="label-v16 mb-4">[TICKETS & RESERVATIONS]</div>
              <MyBookingsView
                orders={orders}
                fleet={fleet}
                onSelectBooking={(b) => setTicketModalBooking(b)}
                onCancelBooking={handleCancelBooking}
                onNewBookingClick={() => setActiveTab('booking')}
                language={language}
              />
            </div>
          )}

          {/* TAB 3: ROUTES & INFO */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-xs">
              <div className="label-v16 mb-4">[GUIDE & ISLAND REGULATIONS]</div>
              <InfoRouteModal onBackToBooking={() => setActiveTab('booking')} />
            </div>
          )}
        </main>

        {/* PANEL 3: RIGHT ASIDE BOOKING & SUMMARY PANEL (360px) */}
        <aside className="p-6 sm:p-8 bg-[#FDFDFD] flex flex-col justify-between border-t lg:border-t-0 border-gray-200 overflow-y-auto">
          <div>
            <h2 className="text-xl font-extrabold text-black mb-5">Booking Details</h2>

            {/* Input 1: Titik Serah Terima / Penjemputan */}
            <div className="mb-5">
              <label className="label-v16 mb-2 block">{language === 'id' ? 'Titik Serah Terima / Jemput' : 'Pickup / Handover Point'}</label>
              {selectedService === 'driver_mobil' ? (
                <div className="p-3.5 bg-[#E8F5E9] border border-[#00AA13]/30 rounded-xl text-xs font-bold text-[#00AA13] flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Pelabuhan Bangsal (Kedatangan)</span>
                </div>
              ) : selectedService === 'rental_sepeda' ? (
                <select
                  value={bikeLocation}
                  onChange={(e) => setBikeLocation(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-black text-xs p-3.5 rounded-xl focus:outline-none focus:border-[#00AA13]"
                >
                  {GILI_POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <select
                    value={ojekPickup}
                    onChange={(e) => setOjekPickup(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-black text-xs p-3 rounded-xl focus:outline-none focus:border-[#00AA13]"
                  >
                    {GILI_POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        Jemput: {loc}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ojekDrop}
                    onChange={(e) => setOjekDrop(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-black text-xs p-3 rounded-xl focus:outline-none focus:border-[#00AA13]"
                  >
                    {GILI_POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        Tujuan: {loc}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Input 2: Durasi & Jumlah */}
            {selectedService === 'rental_sepeda' && (
              <div className="mb-5">
                <label className="label-v16 mb-2 block">{language === 'id' ? 'Durasi & Jumlah' : 'Duration & Units'}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="number"
                    min={1}
                    max={fleet.availableBikes}
                    value={bikeCount}
                    onChange={(e) => setBikeCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-300 text-black text-center font-bold text-sm p-3.5 rounded-xl"
                  />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-300 text-black text-center font-bold text-sm p-3.5 rounded-xl"
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-gray-500 mt-1 px-1 font-bold">
                  <span>JUMLAH UNIT</span>
                  <span>DURASI (HARI)</span>
                </div>
              </div>
            )}

            {/* Input 3: Metode Bayar */}
            <div className="mb-5">
              <label className="label-v16 mb-2 block">{t.formPaymentMethodTitle}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-gray-300 text-black text-xs p-3.5 rounded-xl focus:outline-none focus:border-[#00AA13]"
              >
                <option value="qris">QRIS Nasional (Instant Scan)</option>
                <option value="transfer_bank">Transfer Bank (BCA, BRI, Mandiri, BSI)</option>
                <option value="tunai">Tunai / COD (Bayar di Tempat)</option>
              </select>
            </div>
          </div>

          {/* Total Box matching Variation 16 */}
          <div>
            <div className="total-box-v16">
              <div className="text-[11px] font-bold text-gray-400 tracking-wider">TOTAL PAYMENT</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#00AA13] mt-1">
                {formatRupiah(calculateTotal())}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {language === 'id' ? 'Tanpa biaya tersembunyi. Konfirmasi instan via WA.' : 'No hidden fees. Instant WhatsApp confirmation.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleBookingSubmit}
              className="btn-confirm-v16 w-full mt-4"
            >
              {language === 'id' ? 'Konfirmasi Booking ➔' : 'Confirm Booking ➔'}
            </button>
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (< 1024px) */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('booking')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-colors ${
            activeTab === 'booking' ? 'text-[#00AA13] bg-[#E8F5E9]' : 'text-gray-500'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>{language === 'id' ? 'Layanan' : 'Services'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-orders')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-colors relative ${
            activeTab === 'my-orders' ? 'text-[#00AA13] bg-[#E8F5E9]' : 'text-gray-500'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>{t.navTickets}</span>
          {activeOrdersCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#00AA13] ring-2 ring-white"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold cursor-pointer transition-colors ${
            activeTab === 'info' ? 'text-[#00AA13] bg-[#E8F5E9]' : 'text-gray-500'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.navGuide}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAdminModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold text-gray-500 cursor-pointer hover:text-black"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Mitra</span>
        </button>
      </div>

      {/* FLOATING CUSTOMER SERVICE CHAT WIDGET */}
      <CustomerServiceChat language={language} />

      {/* MODAL: PAYMENT (QRIS / TRANSFER BANK / TUNAI) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingDraft={bookingDraft}
        onConfirmBooking={handleConfirmBooking}
        language={language}
      />

      {/* MODAL: DIGITAL TICKET & SUCCESS */}
      <BookingSuccessModal
        booking={ticketModalBooking}
        fleet={fleet}
        onClose={() => setTicketModalBooking(null)}
        onViewAllOrders={() => {
          setTicketModalBooking(null);
          setActiveTab('my-orders');
        }}
        language={language}
      />

      {/* MODAL: MITRA / ADMIN FLEET MANAGEMENT */}
      <AdminManageModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        fleet={fleet}
        setFleet={setFleet}
        orders={orders}
        setOrders={setOrders}
      />
    </div>
  );
}
