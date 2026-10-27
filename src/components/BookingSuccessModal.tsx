import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Bike, 
  Zap, 
  Car, 
  MessageSquare, 
  Calendar, 
  Clock, 
  MapPin
} from 'lucide-react';
import { Booking, FleetState, Language } from '../types';
import { formatRupiah, createWhatsAppLink, getWhatsAppBookingMessage } from '../utils/formatters';
import { translations } from '../i18n/translations';
import { ItegoLogo } from './ItegoLogo';

interface BookingSuccessModalProps {
  booking: Booking | null;
  fleet: FleetState;
  onClose: () => void;
  onViewAllOrders: () => void;
  language: Language;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  fleet,
  onClose,
  onViewAllOrders,
  language,
}) => {
  if (!booking) return null;
  const t = translations[language];

  const driverPhone =
    booking.serviceType === 'driver_mobil'
      ? fleet.carDriverPhone
      : fleet.electricOjekDriverPhone;

  const waMessage = getWhatsAppBookingMessage(booking);
  const waLink = createWhatsAppLink(driverPhone, waMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-black rounded-3xl border border-gray-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Success Banner */}
        <div className="bg-[#00AA13] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-14 h-14 rounded-2xl bg-white text-[#00AA13] mx-auto flex items-center justify-center mb-3 shadow-lg">
            <CheckCircle2 className="w-8 h-8 stroke-[2.8]" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {language === 'id' ? 'Pesanan Berhasil Dibuat!' : 'Booking Confirmed!'}
          </h2>
          <p className="text-xs text-emerald-100 font-semibold mt-1">
            {language === 'id' ? 'Tiket Digital ITEGO Siap Digunakan' : 'Digital Ticket is Ready to Use'}
          </p>
        </div>

        {/* Digital Ticket Body (Ticket Card) */}
        <div className="p-6 space-y-4">
          <div className="bg-[#FAFAFA] rounded-2xl border-2 border-dashed border-gray-200 p-5 shadow-xs relative overflow-hidden">
            {/* Notch Cutouts for Ticket Effect */}
            <div className="absolute -left-3.5 top-24 w-7 h-7 rounded-full bg-white border-r border-gray-200"></div>
            <div className="absolute -right-3.5 top-24 w-7 h-7 rounded-full bg-white border-l border-gray-200"></div>

            <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <ItegoLogo size="sm" />
                <div>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">KODE TIKET</p>
                  <p className="text-base font-mono font-extrabold text-[#00AA13]">{booking.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30">
                  {booking.bookingStatus}
                </span>
                <p className="text-[10px] font-extrabold mt-1">
                  {booking.paymentStatus === 'lunas' ? (
                    <span className="text-[#00AA13]">✓ LUNAS (QRIS Terverifikasi)</span>
                  ) : booking.paymentMethod === 'tunai' ? (
                    <span className="text-amber-600">Bayar Tunai di Tempat</span>
                  ) : (
                    <span className="text-gray-500">Menunggu Pembayaran</span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center shrink-0 mt-0.5">
                  {booking.serviceType === 'rental_sepeda' && <Bike className="w-4 h-4" />}
                  {booking.serviceType === 'ojek_listrik' && <Zap className="w-4 h-4 fill-current" />}
                  {booking.serviceType === 'driver_mobil' && <Car className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-extrabold text-black text-xs">
                    {booking.serviceType === 'rental_sepeda' && `Rental Sepeda Kayuh (${booking.unitCount} Unit • ${booking.rentalDays} Hari)`}
                    {booking.serviceType === 'ojek_listrik' && `Ojek Sepeda Listrik Gili Trawangan`}
                    {booking.serviceType === 'driver_mobil' && `Mobil Driver: ${booking.destinationName}`}
                  </p>
                  <p className="text-gray-600 text-[11px] mt-0.5">{t.formFullName}: {booking.customerName} ({booking.customerPhone})</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-[11px] truncate">
                  <strong className="text-black">Jemput:</strong> {booking.pickupLocation}
                </span>
              </div>

              {booking.dropLocation && (
                <div className="flex items-center gap-2 text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-[#00AA13] shrink-0" />
                  <span className="text-[11px] truncate">
                    <strong className="text-black">Tujuan:</strong> {booking.dropLocation}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-500 pt-1 text-[11px] font-mono">
                <div className="flex items-center gap-1 font-bold text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{booking.pickupDate}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-gray-700">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{booking.pickupTime}</span>
                </div>
                <div className="font-extrabold text-[#00AA13] text-sm">
                  {formatRupiah(booking.totalPrice)}
                </div>
              </div>
            </div>
          </div>

          {/* Action: WhatsApp Driver */}
          <div className="space-y-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-confirm-v16 w-full py-3.5 text-sm shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              Chat Driver / Admin di WhatsApp
            </a>
            <p className="text-[10px] text-center text-gray-500 font-mono font-medium">
              *Kirim detail tiket otomatis ke WhatsApp driver ({driverPhone})
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onViewAllOrders}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Lihat Tiket Saya
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30 hover:bg-[#00AA13] hover:text-white transition-colors cursor-pointer"
            >
              Pesan Lainnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
