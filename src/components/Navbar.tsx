import React from 'react';
import { Bike, Zap, Car, Ticket, ShieldCheck, HelpCircle, PhoneCall } from 'lucide-react';
import { Booking, Language, AppNotification } from '../types';
import { translations } from '../i18n/translations';
import { LanguageToggle } from './LanguageToggle';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  activeTab: 'booking' | 'my-orders' | 'info';
  setActiveTab: (tab: 'booking' | 'my-orders' | 'info') => void;
  orders: Booking[];
  openAdminModal: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  orders,
  openAdminModal,
  language,
  onLanguageChange,
  notifications,
  setNotifications,
}) => {
  const t = translations[language];
  const activeOrdersCount = orders.filter(
    (o) => o.bookingStatus !== 'selesai' && o.bookingStatus !== 'dibatalkan'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#DCE2E6]/95 backdrop-blur-md border-b border-[#CBD5E1] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('booking')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center border-2 border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.4)]">
              <span className="text-[#00FF66] font-black text-lg sm:text-xl tracking-tighter">IT</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-black">
                  ITEGO<span className="text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">.</span>
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black text-[#00FF66] border border-[#00FF66]/50">
                  {t.areaTag}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium">{t.brandTagline}</p>
            </div>
          </div>

          {/* Right Navigation & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <LanguageToggle
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />

            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              setNotifications={setNotifications}
              language={language}
              onOpenTicket={() => setActiveTab('my-orders')}
            />

            {/* Service Booking Tab */}
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'booking'
                  ? 'bg-black text-[#00FF66] shadow-sm'
                  : 'bg-[#CBD5E1] text-black hover:bg-[#B8C5D3]'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.navBook}</span>
            </button>

            {/* My Tickets Tab */}
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                activeTab === 'my-orders'
                  ? 'bg-black text-[#00FF66] shadow-sm'
                  : 'bg-[#CBD5E1] text-black hover:bg-[#B8C5D3]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navTickets}</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#00FF66] text-black text-[9px] sm:text-[10px] font-black flex items-center justify-center animate-pulse">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Info / Guide Tab */}
            <button
              onClick={() => setActiveTab('info')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'info'
                  ? 'bg-black text-[#00FF66]'
                  : 'bg-[#CBD5E1] text-black hover:bg-[#B8C5D3]'
              }`}
              title={t.navGuide}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.navGuide}</span>
            </button>

            {/* Admin / Partner switch */}
            <button
              onClick={openAdminModal}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white text-gray-800 border border-gray-300 hover:border-black flex items-center gap-1 shadow-2xs transition-colors"
              title="Kelola Armada & Pesanan"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span className="hidden md:inline">{t.navPartner}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
