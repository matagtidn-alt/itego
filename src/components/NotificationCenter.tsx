import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck
} from 'lucide-react';
import { AppNotification, Language } from '../types';
import { translations } from '../i18n/translations';

interface NotificationCenterProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  language: Language;
  onOpenTicket: (bookingId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  setNotifications,
  language,
  onOpenTicket,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (item: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item.type === 'order') {
      setIsOpen(false);
      onOpenTicket();
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#00AA13] hover:border-[#00AA13] transition-all flex items-center justify-center cursor-pointer shadow-2xs"
        title={t.notifTitle}
      >
        <Bell className="w-4 h-4 stroke-[2.2]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00AA13] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-88 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00AA13]" />
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">
                  {t.notifTitle}
                </h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono bg-[#00AA13] text-white px-2 py-0.5 font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-[#00AA13] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  {t.notifMarkAllRead}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2.5 space-y-2">
              {notifications.length === 0 ? (
                <div className="p-6 text-center font-mono text-xs text-gray-400">
                  {t.notifEmpty}
                </div>
              ) : (
                notifications.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.isRead
                          ? 'bg-transparent border-transparent text-gray-500'
                          : 'bg-[#F9FFF9] border-[#00AA13]/30 text-black font-medium'
                      } hover:border-[#00AA13]`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.isRead ? 'bg-gray-300' : 'bg-[#00AA13]'}`}></span>
                          <span className="font-extrabold text-xs text-black">
                            {item.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-600 pl-3.5">
                        {item.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
