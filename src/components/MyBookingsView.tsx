import React from 'react';
import { 
  Bike, 
  Zap, 
  Car, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Plus
} from 'lucide-react';
import { Booking, FleetState, Language } from '../types';
import { formatRupiah, createWhatsAppLink, getWhatsAppBookingMessage } from '../utils/formatters';
import { translations } from '../i18n/translations';

interface MyBookingsViewProps {
  orders: Booking[];
  fleet: FleetState;
  onSelectBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onNewBookingClick: () => void;
  language: Language;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  orders,
  fleet,
  onSelectBooking,
  onCancelBooking,
  onNewBookingClick,
  language,
}) => {
  const t = translations[language];

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#00AA13] mx-auto flex items-center justify-center mb-3 shadow-xs">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-black">{t.noOrdersTitle}</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
          {t.noOrdersDesc}
        </p>
        <button
          onClick={onNewBookingClick}
          className="btn-confirm-v16 px-6 py-3 text-xs inline-flex items-center gap-1.5 mx-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          {t.btnNewBooking}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-black">{t.myBookingsTitle}</h2>
          <p className="text-xs text-gray-500">{t.myBookingsSubtitle}</p>
        </div>
        <button
          onClick={onNewBookingClick}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30 hover:bg-[#00AA13] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {language === 'id' ? 'Pesan Baru' : 'New Booking'}
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isCancelled = order.bookingStatus === 'dibatalkan';
          const isCompleted = order.bookingStatus === 'selesai';
          const driverPhone = order.serviceType === 'driver_mobil' ? fleet.carDriverPhone : fleet.electricOjekDriverPhone;
          const waLink = createWhatsAppLink(driverPhone, getWhatsAppBookingMessage(order));

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border-2 p-4 sm:p-5 transition-all shadow-xs ${
                isCancelled 
                  ? 'opacity-60 border-gray-200' 
                  : 'border-gray-200 hover:border-[#00AA13]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 mb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center shrink-0">
                    {order.serviceType === 'rental_sepeda' && <Bike className="w-5 h-5" />}
                    {order.serviceType === 'ojek_listrik' && <Zap className="w-5 h-5 fill-current" />}
                    {order.serviceType === 'driver_mobil' && <Car className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-black">#{order.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-gray-100 text-gray-700'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30'
                      }`}>
                        {order.bookingStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-extrabold text-sm text-black mt-0.5">
                      {order.serviceType === 'rental_sepeda' && `Rental Sepeda (${order.unitCount} Unit • ${order.rentalDays} Hari)`}
                      {order.serviceType === 'ojek_listrik' && `Ojek Sepeda Listrik Gili Trawangan`}
                      {order.serviceType === 'driver_mobil' && `Mobil Driver: ${order.destinationName}`}
                    </p>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="text-base font-extrabold text-[#00AA13]">{formatRupiah(order.totalPrice)}</span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {order.paymentMethod === 'tunai' ? 'Bayar di Tempat (Tunai)' : 'Lunas (QRIS/Bank)'}
                  </span>
                </div>
              </div>

              {/* Details & Locations */}
              <div className="space-y-1.5 text-xs text-gray-700 mb-3">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="text-[11px]"><strong className="text-black">Jemput:</strong> {order.pickupLocation}</span>
                </div>
                {order.dropLocation && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-[#00AA13] shrink-0" />
                    <span className="text-[11px]"><strong className="text-black">Tujuan:</strong> {order.dropLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-gray-500 text-[11px] pt-1 font-mono">
                  <span className="flex items-center gap-1 font-bold text-gray-700">
                    <Calendar className="w-3 h-3 text-gray-400" /> {order.pickupDate}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-gray-700">
                    <Clock className="w-3 h-3 text-gray-400" /> {order.pickupTime}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectBooking(order)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Buka Tiket
                  </button>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00AA13] text-white hover:bg-[#009310] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    WA Driver
                  </a>
                </div>

                {!isCancelled && !isCompleted && (
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin membatalkan pesanan #${order.id}?`)) {
                        onCancelBooking(order.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer"
                  >
                    Batalkan Pesanan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
