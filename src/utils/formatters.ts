import { Booking } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ITG-${randomNum}`;
}

export function createWhatsAppLink(phone: string, text: string): string {
  const cleanedPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppBookingMessage(booking: Booking): string {
  const serviceName = 
    booking.serviceType === 'rental_sepeda' 
      ? `Rental Sepeda Kayuh (${booking.unitCount} unit - ${booking.rentalDays || 1} hari)` 
      : booking.serviceType === 'ojek_listrik'
      ? `Ojek Sepeda Listrik Gili Trawangan`
      : `Driver Mobil (Pelabuhan Bangsal ➡️ ${booking.destinationName || 'Wisata Lombok Timur'})`;

  return `Halo ITEGO Transport! 👋
Saya ingin mengonfirmasi pesanan saya:

📋 *Kode Booking*: ${booking.id}
🚗 *Layanan*: ${serviceName}
👤 *Nama*: ${booking.customerName}
📞 *No. HP/WA*: ${booking.customerPhone}
📍 *Titik Jemput*: ${booking.pickupLocation}
${booking.dropLocation ? `🏁 *Tujuan*: ${booking.dropLocation}\n` : ''}📅 *Waktu*: ${booking.pickupDate} jam ${booking.pickupTime}
💰 *Total Biaya*: ${formatRupiah(booking.totalPrice)}
💳 *Metode Bayar*: ${booking.paymentMethod === 'tunai' ? 'Tunai (Bayar di Tempat)' : booking.paymentMethod === 'qris' ? 'QRIS Nasional' : 'Transfer Bank'}
📌 *Status*: ${booking.bookingStatus.toUpperCase()}
${booking.customerNote ? `📝 *Catatan*: ${booking.customerNote}\n` : ''}
Mohon konfirmasi ketersediaan dan penjemputannya ya. Terima kasih banyak!`;
}
