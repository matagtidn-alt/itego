import React from 'react';
import { 
  Bike, 
  Car, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';
import { LOMBOK_TIMUR_TOURS } from '../data/constants';
import { formatRupiah } from '../utils/formatters';

interface InfoRouteModalProps {
  onBackToBooking: () => void;
}

export const InfoRouteModal: React.FC<InfoRouteModalProps> = ({ onBackToBooking }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-black">Panduan Rute & Area Layanan ITEGO</h2>
          <p className="text-xs text-gray-500">
            Informasi lengkap seputar operasional di Gili Trawangan & Pelabuhan Bangsal
          </p>
        </div>
        <button
          onClick={onBackToBooking}
          className="btn-confirm-v16 px-4 py-2 text-xs shadow-xs"
        >
          Kembali Pesan
        </button>
      </div>

      {/* 1. Aturan Gili Trawangan */}
      <div className="bg-[#FAFAFA] p-5 rounded-2xl border-2 border-gray-200 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-black">Kenapa Harus Sepeda di Gili Trawangan?</h3>
            <p className="text-[11px] text-[#00AA13] font-bold">Pulau Bebas Polusi Suara & Kendaraan Bermotor</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Gili Trawangan memiliki peraturan adat setempat yang melarang kendaraan bermotor berbahan bakar fosil (motor dan mobil bensin). Transportasi yang diperbolehkan hanyalah <strong>Sepeda Kayuh</strong>, <strong>Sepeda Listrik</strong>, dan Cidomo (kereta kuda).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <p className="font-extrabold text-black flex items-center gap-1.5">
              🚲 10 Unit Sepeda Kayuh ITEGO
            </p>
            <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
              Hanya <strong className="text-[#00AA13]">Rp 50.000 / hari</strong>. Cocok untuk gowes santai keliling pulau (± 7 km melingkari bibir pantai), berburu sunset di barat dan snorkeling di timur.
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <p className="font-extrabold text-black flex items-center gap-1.5">
              ⚡ 1 Unit Ojek Sepeda Listrik ITEGO
            </p>
            <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
              Hanya <strong className="text-[#00AA13]">Rp 20.000 / sekali jalan</strong>. Layanan praktis jika Anda membawa koper kecil atau lelah setelah berenang seharian. Cepat dan bebas capek!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Pelabuhan Bangsal & Driver Mobil Lombok Timur */}
      <div className="bg-[#FAFAFA] p-5 rounded-2xl border-2 border-gray-200 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#00AA13] flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-black">Titik Penjemputan Pelabuhan Bangsal</h3>
            <p className="text-[11px] text-[#00AA13] font-bold">Pintu Keluar Fast Boat & Public Boat dari Gili Trawangan</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Pelabuhan Bangsal adalah dermaga utama penyeberangan kapal dari dan menuju Gili Trawangan. Driver mobil ITEGO (Toyota Avanza Veloz nyaman & AC dingin) akan siap menunggu Anda di gerbang kedatangan dermaga Bangsal dengan papan nama Anda.
        </p>

        <h4 className="text-xs font-extrabold text-black pt-2">Destinasi Wisata Populer Lombok Timur:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {LOMBOK_TIMUR_TOURS.map((t) => (
            <div key={t.id} className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-black">{t.title}</span>
                <span className="font-bold text-[#00AA13]">{formatRupiah(t.price)}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Cara Pembayaran & Kontak */}
      <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#00AA13]/30 text-black space-y-2">
        <h3 className="text-xs font-extrabold uppercase text-[#00AA13] tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Sistem Pembayaran Mudah & Transparan:
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed">
          • <strong>Tunai (Bayar di Tempat):</strong> Bayar langsung saat serah terima sepeda atau bertemu driver di Pelabuhan Bangsal.<br />
          • <strong>QRIS Nasional:</strong> Scan pakai GoPay, OVO, Dana, ShopeePay, atau m-Banking (BCA, Mandiri, BRI, BSI).<br />
          • <strong>Transfer Bank:</strong> Tersedia nomor rekening resmi BCA, BRI, Mandiri, dan BSI.
        </p>
      </div>
    </div>
  );
};
