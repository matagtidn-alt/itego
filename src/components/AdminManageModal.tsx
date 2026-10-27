import React from 'react';
import { 
  X, 
  Shield, 
  Bike, 
  Zap, 
  Car, 
  MessageSquare
} from 'lucide-react';
import { FleetState, Booking } from '../types';
import { formatRupiah, createWhatsAppLink } from '../utils/formatters';
import { ItegoLogo } from './ItegoLogo';

interface AdminManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  fleet: FleetState;
  setFleet: React.Dispatch<React.SetStateAction<FleetState>>;
  orders: Booking[];
  setOrders: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const AdminManageModal: React.FC<AdminManageModalProps> = ({
  isOpen,
  onClose,
  fleet,
  setFleet,
  orders,
  setOrders,
}) => {
  if (!isOpen) return null;

  const totalRevenue = orders
    .filter((o) => o.bookingStatus !== 'dibatalkan')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const updateBikeAvailability = (newCount: number) => {
    const clamped = Math.max(0, Math.min(fleet.totalBikes, newCount));
    setFleet((prev) => ({ ...prev, availableBikes: clamped }));
  };

  const updateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, bookingStatus: newStatus } : ord))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-black rounded-3xl border border-gray-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#00AA13] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ItegoLogo size="sm" variant="dark-pill" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Panel Mitra & Pengelola ITEGO
              </h3>
              <p className="text-[11px] text-emerald-100 font-semibold">
                Kontrol Ketersediaan Armada & Rekap Pesanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Revenue & Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">Total Omzet</p>
              <p className="text-base font-extrabold text-[#00AA13] mt-0.5">{formatRupiah(totalRevenue)}</p>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">Total Pesanan</p>
              <p className="text-base font-extrabold text-black mt-0.5">{orders.length} Transaksi</p>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">Sepeda Siap</p>
              <p className="text-base font-mono font-extrabold text-[#00AA13] mt-0.5">{fleet.availableBikes} / {fleet.totalBikes}</p>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">Ojek & Mobil</p>
              <p className="text-base font-extrabold text-black mt-0.5">1 & 1 Unit</p>
            </div>
          </div>

          {/* FLEET MANAGEMENT CONTROLS */}
          <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 space-y-4">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Status & Ketersediaan Unit Saat Ini:
            </h4>

            {/* 1. Sepeda Kayuh (10 Unit) */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-black">10 Unit Sepeda Kayuh (Gili Trawangan)</p>
                  <p className="text-[11px] text-gray-500">Tarif sewa: Rp 50.000 / unit / hari</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Tersedia:</span>
                <button
                  type="button"
                  onClick={() => updateBikeAvailability(fleet.availableBikes - 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-gray-300 font-bold text-xs text-black hover:border-[#00AA13] cursor-pointer shadow-2xs"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-extrabold text-base text-[#00AA13]">
                  {fleet.availableBikes}
                </span>
                <button
                  type="button"
                  onClick={() => updateBikeAvailability(fleet.availableBikes + 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-gray-300 font-bold text-xs text-black hover:border-[#00AA13] cursor-pointer shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* 2. Ojek Listrik (1 Unit) */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-black">1 Unit Ojek Sepeda Listrik (Gili Trawangan)</p>
                  <p className="text-[11px] text-gray-500">Driver: {fleet.electricOjekDriverName} (Rp 20.000 / trip)</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, electricOjekStatus: 'ready' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.electricOjekStatus === 'ready'
                      ? 'bg-[#00AA13] text-white border-[#00AA13] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Siap Antar
                </button>
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, electricOjekStatus: 'busy' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.electricOjekStatus === 'busy'
                      ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Jalan
                </button>
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, electricOjekStatus: 'off' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.electricOjekStatus === 'off'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Off
                </button>
              </div>
            </div>

            {/* 3. Driver Mobil (1 Unit) */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-black">1 Unit Mobil Driver (Pelabuhan Bangsal)</p>
                  <p className="text-[11px] text-gray-500">{fleet.carType} • Wisata Lombok Timur</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, carDriverStatus: 'ready' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.carDriverStatus === 'ready'
                      ? 'bg-[#00AA13] text-white border-[#00AA13] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Standby
                </button>
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, carDriverStatus: 'busy' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.carDriverStatus === 'busy'
                      ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Antar
                </button>
                <button
                  type="button"
                  onClick={() => setFleet((p) => ({ ...p, carDriverStatus: 'scheduled' }))}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    fleet.carDriverStatus === 'scheduled'
                      ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Jadwal
                </button>
              </div>
            </div>
          </div>

          {/* INCOMING BOOKINGS LIST */}
          <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Daftar Pesanan Pelanggan Masuk:
            </h4>

            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center font-medium">Belum ada pesanan masuk.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  const customerWaLink = createWhatsAppLink(
                    o.customerPhone,
                    `Halo ${o.customerName}, kami dari ITEGO mengonfirmasi pesanan tiket #${o.id}. Kami siap melayani Anda!`
                  );

                  return (
                    <div key={o.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-black">#{o.id}</span>
                          <span className="font-extrabold text-black">{o.customerName}</span>
                          <span className="text-[10px] text-gray-500 font-mono">({o.customerPhone})</span>
                        </div>
                        <span className="font-extrabold text-[#00AA13] text-sm">{formatRupiah(o.totalPrice)}</span>
                      </div>

                      <div className="text-[11px] text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Layanan: <strong>{o.serviceType}</strong></span>
                        <span>Jemput: <strong>{o.pickupLocation}</strong></span>
                        <span>Waktu: <strong>{o.pickupDate} {o.pickupTime}</strong></span>
                        <span>Bayar: <strong className="text-[#00AA13]">{o.paymentMethod.toUpperCase()}</strong></span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'terkonfirmasi')}
                            className="px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30 text-[10px] font-bold cursor-pointer hover:bg-[#00AA13] hover:text-white transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'selesai')}
                            className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-800 text-[10px] font-bold cursor-pointer hover:bg-gray-300 transition-colors"
                          >
                            Selesai
                          </button>
                        </div>

                        <a
                          href={customerWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-[#00AA13] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#009310] transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Chat Pemesan
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
