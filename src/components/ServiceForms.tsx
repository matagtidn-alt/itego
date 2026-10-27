import React, { useState } from 'react';
import { 
  Bike, 
  Zap, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Check, 
  AlertCircle, 
  Info, 
  Sparkles, 
  Shield, 
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { ServiceType, FleetState, PaymentMethod, TourPackage, Language } from '../types';
import { GILI_POPULAR_LOCATIONS, LOMBOK_TIMUR_TOURS } from '../data/constants';
import { formatRupiah } from '../utils/formatters';
import { translations } from '../i18n/translations';

interface ServiceFormsProps {
  serviceType: ServiceType;
  fleet: FleetState;
  onProceedToPayment: (bookingData: any) => void;
  language: Language;
}

export const ServiceForms: React.FC<ServiceFormsProps> = ({
  serviceType,
  fleet,
  onProceedToPayment,
  language,
}) => {
  const t = translations[language];

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // Service 1: Rental Sepeda Kayuh state
  const [bikeCount, setBikeCount] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  const [bikePickupDate, setBikePickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bikePickupTime, setBikePickupTime] = useState('09:00');
  const [bikeLocation, setBikeLocation] = useState(GILI_POPULAR_LOCATIONS[0]);
  const [customBikeLocation, setCustomBikeLocation] = useState('');

  // Service 2: Ojek Sepeda Listrik state
  const [ojekPickup, setOjekPickup] = useState(GILI_POPULAR_LOCATIONS[0]);
  const [customOjekPickup, setCustomOjekPickup] = useState('');
  const [ojekDrop, setOjekDrop] = useState(GILI_POPULAR_LOCATIONS[1]);
  const [customOjekDrop, setCustomOjekDrop] = useState('');
  const [ojekTiming, setOjekTiming] = useState<'sekarang' | 'jadwal'>('sekarang');
  const [ojekScheduledTime, setOjekScheduledTime] = useState('14:00');

  // Service 3: Driver Mobil Bangsal -> Lombok Timur state
  const [selectedTour, setSelectedTour] = useState<TourPackage>(LOMBOK_TIMUR_TOURS[0]);
  const [carDate, setCarDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [carTime, setCarTime] = useState('09:30');
  const [passengerCount, setPassengerCount] = useState(2);
  const [boatInfo, setBoatInfo] = useState('');
  const [customDestination, setCustomDestination] = useState('');

  // Validation
  const [errorMsg, setErrorMsg] = useState('');

  // Price calculations
  const calculateTotal = (): number => {
    if (serviceType === 'rental_sepeda') {
      return bikeCount * rentalDays * fleet.bikePricePerDay;
    }
    if (serviceType === 'ojek_listrik') {
      return fleet.electricOjekPricePerTrip;
    }
    if (serviceType === 'driver_mobil') {
      return selectedTour.price;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Mohon masukkan nama pemesan.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg('Mohon masukkan nomor WhatsApp / HP yang aktif.');
      return;
    }

    let pickupFinal = '';
    let dropFinal = '';
    let pickupDate = '';
    let pickupTime = '';

    if (serviceType === 'rental_sepeda') {
      if (fleet.availableBikes < bikeCount) {
        setErrorMsg(`Maaf, saat ini sepeda yang tersedia hanya ${fleet.availableBikes} unit.`);
        return;
      }
      pickupFinal = bikeLocation === 'Lainnya / Tulis Alamat Sendiri' ? customBikeLocation : bikeLocation;
      if (!pickupFinal) pickupFinal = 'Pelabuhan Gili Trawangan';
      pickupDate = bikePickupDate;
      pickupTime = bikePickupTime;
    } else if (serviceType === 'ojek_listrik') {
      pickupFinal = ojekPickup === 'Lainnya / Tulis Alamat Sendiri' ? customOjekPickup : ojekPickup;
      dropFinal = ojekDrop === 'Lainnya / Tulis Alamat Sendiri' ? customOjekDrop : ojekDrop;
      if (!pickupFinal) pickupFinal = 'Pelabuhan Gili Trawangan';
      if (!dropFinal) dropFinal = 'Sunset Point Gili T';
      pickupDate = new Date().toISOString().split('T')[0];
      pickupTime = ojekTiming === 'sekarang' ? 'Sekarang (Segera)' : ojekScheduledTime;
    } else if (serviceType === 'driver_mobil') {
      pickupFinal = 'Pelabuhan Bangsal (Lombok Utara)';
      dropFinal = selectedTour.title + (customDestination ? ` (${customDestination})` : '');
      pickupDate = carDate;
      pickupTime = carTime;
    }

    const payload = {
      serviceType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerNote: customerNote.trim(),
      unitCount: serviceType === 'rental_sepeda' ? bikeCount : 1,
      rentalDays: serviceType === 'rental_sepeda' ? rentalDays : undefined,
      pickupLocation: pickupFinal,
      dropLocation: dropFinal,
      pickupDate,
      pickupTime,
      destinationPackage: serviceType === 'driver_mobil' ? selectedTour.id : undefined,
      destinationName: serviceType === 'driver_mobil' ? selectedTour.title : undefined,
      passengerCount: serviceType === 'driver_mobil' ? passengerCount : undefined,
      flightOrBoatInfo: boatInfo.trim() || undefined,
      unitPrice: serviceType === 'rental_sepeda' ? fleet.bikePricePerDay : serviceType === 'ojek_listrik' ? fleet.electricOjekPricePerTrip : selectedTour.price,
      totalPrice: calculateTotal(),
      paymentMethod,
    };

    onProceedToPayment(payload);
  };

  return (
    <div className="card-editorial p-6 sm:p-8">
      {/* Editorial Label & Header */}
      <span className="label-editorial mb-2">
        [03] {language === 'id' ? 'FORMULIR PEMESANAN' : 'BOOKING FORM'}
      </span>
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 mb-6 border-b border-[#111113]/10 gap-3">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111113]">
            {serviceType === 'rental_sepeda' && (language === 'id' ? 'Rental Sepeda Kayuh' : 'Pedal Bike Rental')}
            {serviceType === 'ojek_listrik' && (language === 'id' ? 'Ojek Sepeda Listrik' : 'Electric Bike Taxi')}
            {serviceType === 'driver_mobil' && (language === 'id' ? 'Driver Mobil: Bangsal ➡️ Lombok Timur' : 'Private Car: Bangsal ➡️ East Lombok')}
          </h2>
          <p className="font-body text-xs text-[#111113]/60 mt-1 font-medium">
            {serviceType === 'rental_sepeda' && (language === 'id' ? '10 Unit Sepeda Kayuh • Area Khusus Gili Trawangan' : '10 Bicycles Available • Exclusive for Gili Trawangan')}
            {serviceType === 'ojek_listrik' && (language === 'id' ? '1 Unit Armada Eksklusif • Area Khusus Gili Trawangan' : '1 Exclusive Unit • Gili Trawangan Area')}
            {serviceType === 'driver_mobil' && (language === 'id' ? '1 Unit Avanza AC + Driver Ramah • Penjemputan Pelabuhan Bangsal' : '1 AC Avanza Car + Driver • Bangsal Port Arrival Pickup')}
          </p>
        </div>

        {/* Price Tag Pill */}
        <div className="self-start sm:self-auto bg-[#111113] text-white px-4 py-2 font-mono">
          <p className="text-[10px] text-white/50 uppercase tracking-widest">{t.transparentRate}</p>
          <p className="text-base font-bold text-[#E8652D]">
            {serviceType === 'rental_sepeda' && `${formatRupiah(fleet.bikePricePerDay)} / Day`}
            {serviceType === 'ojek_listrik' && `${formatRupiah(fleet.electricOjekPricePerTrip)} / Trip`}
            {serviceType === 'driver_mobil' && `Mulai ${formatRupiah(400000)} / Car`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SERVICE-SPECIFIC CONTROLS */}

        {/* 1. RENTAL SEPEDA KAYUH FORM */}
        {serviceType === 'rental_sepeda' && (
          <div className="space-y-4 bg-[#F1F5F9] p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Jumlah Sepeda */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  Jumlah Sepeda (Tersedia: {fleet.availableBikes} dari {fleet.totalBikes} Unit)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBikeCount(Math.max(1, bikeCount - 1))}
                    disabled={bikeCount <= 1}
                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 font-bold text-lg disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center py-2 bg-white rounded-lg border border-gray-300 font-black text-black">
                    {bikeCount} Unit Sepeda
                  </div>
                  <button
                    type="button"
                    onClick={() => setBikeCount(Math.min(fleet.availableBikes, bikeCount + 1))}
                    disabled={bikeCount >= fleet.availableBikes}
                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 font-bold text-lg disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  *Rp 50.000 per unit per hari
                </p>
              </div>

              {/* Durasi Hari Sewa */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  Durasi Sewa (Hari)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 5].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setRentalDays(d)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        rentalDays === d
                          ? 'bg-black text-[#00FF66] border-black shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {d} Hari
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Atau pilih kustom:</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-center text-xs font-bold"
                  />
                  <span className="text-gray-600">hari</span>
                </div>
              </div>
            </div>

            {/* Lokasi Serah Terima Sepeda */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Titik Serah Terima / Pengantaran di Gili Trawangan
              </label>
              <select
                value={bikeLocation}
                onChange={(e) => setBikeLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#00FF66]"
              >
                {GILI_POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
                <option value="Lainnya / Tulis Alamat Sendiri">✏️ Lainnya / Tulis Hotel Saya</option>
              </select>

              {bikeLocation === 'Lainnya / Tulis Alamat Sendiri' && (
                <input
                  type="text"
                  placeholder="Ketik nama hotel, homestay, atau patokan di Gili T..."
                  value={customBikeLocation}
                  onChange={(e) => setCustomBikeLocation(e.target.value)}
                  className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
              )}
            </div>

            {/* Tanggal & Waktu Mulai Sewa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Mulai Tanggal Sewa
                </label>
                <input
                  type="date"
                  value={bikePickupDate}
                  onChange={(e) => setBikePickupDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Jam Pengambilan
                </label>
                <input
                  type="time"
                  value={bikePickupTime}
                  onChange={(e) => setBikePickupTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            {/* Fasilitas Gratis */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-gray-700">
              <span className="bg-white px-2.5 py-1 rounded-md border border-gray-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-[#00FF66] bg-black rounded-full p-0.5" /> Gratis Kunci Gembok
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-gray-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-[#00FF66] bg-black rounded-full p-0.5" /> Keranjang Sepeda
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-gray-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-[#00FF66] bg-black rounded-full p-0.5" /> Antar Gratis ke Hotel
              </span>
            </div>
          </div>
        )}

        {/* 2. OJEK SEPEDA LISTRIK FORM */}
        {serviceType === 'ojek_listrik' && (
          <div className="space-y-4 bg-[#F1F5F9] p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between bg-black text-[#00FF66] p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-[#00FF66]" />
                <div>
                  <p className="text-xs font-black">1 Unit Ojek Sepeda Listrik Standby</p>
                  <p className="text-[10px] text-gray-300">Driver lokal terpercaya: {fleet.electricOjekDriverName}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold bg-[#00FF66] text-black px-2.5 py-1 rounded-lg">
                Tarif Flat Rp 20.000
              </span>
            </div>

            {/* Titik Jemput */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Titik Penjemputan di Gili Trawangan
              </label>
              <select
                value={ojekPickup}
                onChange={(e) => setOjekPickup(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#00FF66]"
              >
                {GILI_POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="Lainnya / Tulis Alamat Sendiri">✏️ Ketik Lokasi Jemput Lainnya</option>
              </select>
              {ojekPickup === 'Lainnya / Tulis Alamat Sendiri' && (
                <input
                  type="text"
                  placeholder="Contoh: Depan Resto Scallywags / Hotel Ombak..."
                  value={customOjekPickup}
                  onChange={(e) => setCustomOjekPickup(e.target.value)}
                  className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
              )}
            </div>

            {/* Titik Tujuan */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Titik Tujuan di Gili Trawangan
              </label>
              <select
                value={ojekDrop}
                onChange={(e) => setOjekDrop(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#00FF66]"
              >
                {GILI_POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="Lainnya / Tulis Alamat Sendiri">✏️ Ketik Lokasi Tujuan Lainnya</option>
              </select>
              {ojekDrop === 'Lainnya / Tulis Alamat Sendiri' && (
                <input
                  type="text"
                  placeholder="Contoh: Sunset Point, Pearl Beach Lounge, dll..."
                  value={customOjekDrop}
                  onChange={(e) => setCustomOjekDrop(e.target.value)}
                  className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                />
              )}
            </div>

            {/* Waktu Jemput */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Waktu Penjemputan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOjekTiming('sekarang')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    ojekTiming === 'sekarang'
                      ? 'bg-black text-[#00FF66] border-black shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-[#00FF66]" />
                  Jemput Sekarang (5-10 mnt)
                </button>
                <button
                  type="button"
                  onClick={() => setOjekTiming('jadwal')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    ojekTiming === 'jadwal'
                      ? 'bg-black text-[#00FF66] border-black shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Jadwalkan Jam
                </button>
              </div>

              {ojekTiming === 'jadwal' && (
                <div className="mt-2.5">
                  <input
                    type="time"
                    value={ojekScheduledTime}
                    onChange={(e) => setOjekScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
              💡 <em>Catatan:</em> Gili Trawangan adalah pulau bebas kendaraan bermotor berbahan bakar bensin. Ojek sepeda listrik ITEGO 100% ramah lingkungan dan legal di pulau.
            </p>
          </div>
        )}

        {/* 3. DRIVER MOBIL BANGSAL -> LOMBOK TIMUR FORM */}
        {serviceType === 'driver_mobil' && (
          <div className="space-y-4 bg-[#F1F5F9] p-4 rounded-xl border border-slate-200">
            {/* Informasi Penjemputan Khusus */}
            <div className="bg-black text-[#00FF66] p-3 rounded-xl border border-[#00FF66]/40">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#00FF66]" />
                <div>
                  <p className="text-xs font-black">Khusus Penjemputan di Pelabuhan Bangsal</p>
                  <p className="text-[10px] text-gray-300">
                    Pintu gerbang dari/ke Gili Trawangan menuju pesona wisata Lombok Timur
                  </p>
                </div>
              </div>
            </div>

            {/* Pilihan Paket Wisata Lombok Timur */}
            <div>
              <label className="block text-xs font-bold text-black mb-2">
                Pilih Destinasi Wisata Lombok Timur:
              </label>
              <div className="space-y-2.5">
                {LOMBOK_TIMUR_TOURS.map((tour) => {
                  const isSelected = selectedTour.id === tour.id;
                  return (
                    <div
                      key={tour.id}
                      onClick={() => setSelectedTour(tour)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-[#00FF66] ring-2 ring-[#00FF66]/30 shadow-md'
                          : 'bg-white/80 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-black">{tour.title}</h4>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                              {tour.imageBadge}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1">{tour.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tour.highlights.map((h, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-100 text-gray-700 px-2 py-0.5 rounded">
                                • {h}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-black">{formatRupiah(tour.price)}</p>
                          <p className="text-[10px] text-gray-500">{tour.duration}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom request jika mau */}
            {selectedTour.id === 'custom-all-day' && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-[#00FF66]">
                <label className="block text-xs font-black text-black mb-1">
                  {language === 'id' 
                    ? '✍️ Tulis Rute / Destinasi yang Ingin Anda Request di Lombok Timur:' 
                    : '✍️ Specify Destinations / Routes You Would Like to Request in East Lombok:'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'id' ? 'Contoh: Sembalun pagi, siang ke Tetebatu, sore ke Pantai Pink / Korleko...' : 'E.g., Sembalun in the morning, Tetebatu afternoon, sunset at Pink Beach...'}
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00FF66] focus:outline-none"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  {language === 'id'
                    ? '*Driver ramah kami siap mendampingi perjalanan custom Anda seharian penuh (10-12 jam).'
                    : '*Our friendly private driver will accompany your custom full-day journey (10-12 hours).'}
                </p>
              </div>
            )}

            {/* Tanggal & Waktu Kedatangan di Bangsal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Tanggal Kedatangan
                </label>
                <input
                  type="date"
                  value={carDate}
                  onChange={(e) => setCarDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Jam Tiba di Bangsal
                </label>
                <input
                  type="time"
                  value={carTime}
                  onChange={(e) => setCarTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Jumlah Penumpang
                </label>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                >
                  <option value={1}>1 Orang (Kapasitas lega)</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={5}>5 Orang</option>
                  <option value={6}>6 Orang (Maksimal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Nama Kapal / Speedboat (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Kapal Publik Gili T / Fastboat Eka Jaya jam 09:00"
                value={boatInfo}
                onChange={(e) => setBoatInfo(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                *Driver akan standby memegang papan nama Anda di pintu keluar dermaga Pelabuhan Bangsal.
              </p>
            </div>
          </div>
        )}

        {/* CUSTOMER INFORMATION SECTION (SUPER SIMPLE & EASY) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold text-black flex items-center gap-2">
            <User className="w-4 h-4 text-black" />
            {t.formCustomerData}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {t.formFullName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={language === 'id' ? 'Contoh: Rian Pratama' : 'E.g., John Miller'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00FF66] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {t.formPhone} <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder={language === 'id' ? 'Contoh: 081234567890' : 'E.g., +62 812-3456-7890'}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00FF66] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              {t.formNote}
            </label>
            <input
              type="text"
              placeholder={t.formNotePlaceholder}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* PAYMENT METHOD SELECTION */}
        <div className="space-y-3 pt-2">
          <label className="label-editorial">[04] {t.formPaymentMethodTitle}</label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Opsi 1: QRIS */}
            <div
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 border cursor-pointer transition-all ${
                paymentMethod === 'qris'
                  ? 'border-[#111113] bg-[#111113] text-white shadow-[3px_3px_0px_#E8652D]'
                  : 'bg-white border-[#111113]/15 text-[#111113] hover:border-[#111113]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold uppercase">{t.qrisTitle}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 font-bold ${
                  paymentMethod === 'qris' ? 'bg-[#E8652D] text-white' : 'bg-[#111113]/10 text-[#111113]'
                }`}>
                  INSTANT
                </span>
              </div>
              <p className={`text-[11px] leading-snug ${paymentMethod === 'qris' ? 'text-white/70' : 'text-[#111113]/60'}`}>
                {t.qrisSubtitle}
              </p>
            </div>

            {/* Opsi 2: Transfer Bank */}
            <div
              onClick={() => setPaymentMethod('transfer_bank')}
              className={`p-4 border cursor-pointer transition-all ${
                paymentMethod === 'transfer_bank'
                  ? 'border-[#111113] bg-[#111113] text-white shadow-[3px_3px_0px_#E8652D]'
                  : 'bg-white border-[#111113]/15 text-[#111113] hover:border-[#111113]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold uppercase">{t.bankTitle}</span>
                </div>
              </div>
              <p className={`text-[11px] leading-snug ${paymentMethod === 'transfer_bank' ? 'text-white/70' : 'text-[#111113]/60'}`}>
                {t.bankSubtitle}
              </p>
            </div>

            {/* Opsi 3: Tunai */}
            <div
              onClick={() => setPaymentMethod('tunai')}
              className={`p-4 border cursor-pointer transition-all ${
                paymentMethod === 'tunai'
                  ? 'border-[#111113] bg-[#111113] text-white shadow-[3px_3px_0px_#E8652D]'
                  : 'bg-white border-[#111113]/15 text-[#111113] hover:border-[#111113]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold uppercase">{t.codTitle}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 font-bold ${
                  paymentMethod === 'tunai' ? 'bg-[#E8652D] text-white' : 'bg-[#111113]/10 text-[#111113]'
                }`}>
                  COD
                </span>
              </div>
              <p className={`text-[11px] leading-snug ${paymentMethod === 'tunai' ? 'text-white/70' : 'text-[#111113]/60'}`}>
                {t.codSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="p-3 border border-rose-500 bg-rose-50 text-rose-900 font-mono text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* PRICE SUMMARY & SUBMIT ACTION */}
        <div className="border border-[#111113]/15 bg-[#F8F7F4] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="label-editorial">{t.formTotalLabel}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-3xl font-bold text-[#111113]">
                {formatRupiah(calculateTotal())}
              </span>
              <span className="font-mono text-xs text-[#111113]/50">
                ({paymentMethod === 'tunai' ? 'CASH' : 'NON-CASH'})
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#111113]/50 mt-1">
              {t.formNoHiddenFees}
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-[#111113] text-white hover:bg-[#E8652D] font-mono text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0px_#E8652D]"
          >
            Confirm Booking Now ➔
          </button>
        </div>
      </form>
    </div>
  );
};
