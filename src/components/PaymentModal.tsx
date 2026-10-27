import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Clock,
  Sparkles,
  CheckCircle2,
  Loader2,
  Smartphone,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, PaymentMethod, Language } from '../types';
import { BANK_ACCOUNTS } from '../data/constants';
import { formatRupiah } from '../utils/formatters';
import { translations } from '../i18n/translations';
import { ItegoLogo } from './ItegoLogo';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDraft: any;
  onConfirmBooking: (finalBooking: Booking) => void;
  language: Language;
}

interface MockTransaction {
  refId: string;
  source: string;
  amount: number;
  timestamp: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingDraft,
  onConfirmBooking,
  language,
}) => {
  if (!isOpen || !bookingDraft) return null;
  const t = translations[language];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(bookingDraft.paymentMethod || 'qris');
  const [selectedBank, setSelectedBank] = useState(BANK_ACCOUNTS[0]);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  // Mock QRIS Verification Flow States
  const [qrisStep, setQrisStep] = useState<'waiting' | 'detecting' | 'verified'>('waiting');
  const [detectedTx, setDetectedTx] = useState<MockTransaction | null>(null);
  const [autoSimulateSeconds, setAutoSimulateSeconds] = useState(8);
  const [isAutoSimulateActive, setIsAutoSimulateActive] = useState(true);

  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // General 15-min countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset QRIS verification state when switching methods
  useEffect(() => {
    if (paymentMethod !== 'qris') {
      setQrisStep('waiting');
      setDetectedTx(null);
      setIsProcessing(false);
      if (verificationTimeoutRef.current) clearTimeout(verificationTimeoutRef.current);
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current);
    }
  }, [paymentMethod]);

  // Auto-simulation countdown for QRIS
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'qris' || qrisStep !== 'waiting' || !isAutoSimulateActive) {
      return;
    }

    const interval = setInterval(() => {
      setAutoSimulateSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerSimulatedQrisPayment('BCA Mobile / GoPay (Auto-Detected)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, paymentMethod, qrisStep, isAutoSimulateActive]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (verificationTimeoutRef.current) clearTimeout(verificationTimeoutRef.current);
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyToClipboard = (text: string, type: 'bank' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  // Trigger Mock QRIS Verification Flow
  const triggerSimulatedQrisPayment = (customSource?: string) => {
    if (qrisStep !== 'waiting') return;

    setQrisStep('detecting');
    setIsProcessing(true);

    const sourceName = customSource || `m-Banking / GoPay (${bookingDraft.customerName || 'Pembeli'})`;
    const mockTx: MockTransaction = {
      refId: `QRIS-${Math.floor(100000 + Math.random() * 900000)}`,
      source: sourceName,
      amount: bookingDraft.totalPrice,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setDetectedTx(mockTx);

    // Step 2: After 1.3s, payment is validated & status updated to 'lunas'
    verificationTimeoutRef.current = setTimeout(() => {
      setQrisStep('verified');

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00AA13', '#10E575', '#000000', '#FFFFFF'],
        });
      } catch (e) {
        // safe fallback
      }

      // Step 3: Automatically finalize booking with 'lunas' status
      finalizeTimeoutRef.current = setTimeout(() => {
        const finalBooking: Booking = {
          ...bookingDraft,
          id: `ITG-${Math.floor(1000 + Math.random() * 9000)}`,
          paymentMethod: 'qris',
          paymentStatus: 'lunas', // <-- Automatically marked as LUNAS
          bookingStatus: 'terkonfirmasi',
          createdAt: new Date().toISOString(),
        };

        setIsProcessing(false);
        onConfirmBooking(finalBooking);
      }, 1600);
    }, 1300);
  };

  // Manual complete for Cash or Bank Transfer
  const handleManualComplete = () => {
    if (paymentMethod === 'qris') {
      // If user clicks button directly in QRIS mode, run the verification simulation
      triggerSimulatedQrisPayment('m-Banking App (Manual Confirmation)');
      return;
    }

    setIsProcessing(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00AA13', '#10E575', '#000000', '#ffffff'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      const finalBooking: Booking = {
        ...bookingDraft,
        id: `ITG-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod,
        bankChosen: paymentMethod === 'transfer_bank' ? selectedBank.bankName : undefined,
        paymentStatus: paymentMethod === 'tunai' ? 'bayar_di_tempat' : 'lunas',
        bookingStatus: 'terkonfirmasi',
        createdAt: new Date().toISOString(),
      };
      setIsProcessing(false);
      onConfirmBooking(finalBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white text-black rounded-3xl border border-gray-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ItegoLogo size="sm" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-black">
                {language === 'id' ? 'Konfirmasi & Pembayaran' : 'Confirm & Payment'}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'id' ? 'Sistem Pembayaran Terpadu ITEGO' : 'ITEGO Integrated Payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Summary Box */}
          <div className="bg-[#F9FFF9] p-4 rounded-2xl border-2 border-[#00AA13]/30">
            <div className="flex justify-between items-start text-xs border-b border-gray-100 pb-2.5 mb-2.5">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold">
                  {language === 'id' ? 'LAYANAN' : 'SERVICE'}
                </p>
                <p className="font-extrabold text-sm text-black mt-0.5">
                  {bookingDraft.serviceType === 'rental_sepeda' && `Rental Sepeda (${bookingDraft.unitCount} Unit • ${bookingDraft.rentalDays} Hari)`}
                  {bookingDraft.serviceType === 'ojek_listrik' && `Ojek Sepeda Listrik Gili Trawangan`}
                  {bookingDraft.serviceType === 'driver_mobil' && `Driver Mobil: ${bookingDraft.destinationName}`}
                </p>
              </div>
              <span className="bg-[#E8F5E9] text-[#00AA13] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#00AA13]/30">
                READY
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase">PEMESAN</p>
                <p className="font-bold text-black">{bookingDraft.customerName} ({bookingDraft.customerPhone})</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-mono uppercase">TOTAL BAYAR</p>
                <p className="font-extrabold text-base text-[#00AA13]">
                  {formatRupiah(bookingDraft.totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="label-v16 block mb-2">PILIH METODE PEMBAYARAN:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`py-3 px-1 text-xs font-bold rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'bg-[#E8F5E9] text-[#00AA13] border-[#00AA13] shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[11px]">QRIS Instan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer_bank')}
                className={`py-3 px-1 text-xs font-bold rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'transfer_bank'
                    ? 'bg-[#E8F5E9] text-[#00AA13] border-[#00AA13] shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px]">Transfer Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('tunai')}
                className={`py-3 px-1 text-xs font-bold rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'tunai'
                    ? 'bg-[#E8F5E9] text-[#00AA13] border-[#00AA13] shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span className="text-[11px]">Tunai / COD</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: QRIS SCREEN WITH MOCK VERIFICATION FLOW */}
          {paymentMethod === 'qris' && (
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 space-y-4 shadow-2xs">
              
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-rose-600 text-sm tracking-tight">QRIS</span>
                  <span className="text-[10px] text-gray-500 font-semibold">QR Standar Pembayaran Nasional</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#00AA13]">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{timeFormatted}</span>
                </div>
              </div>

              {/* Status Banner */}
              {qrisStep === 'waiting' && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Menunggu Pembayaran (Auto-polling aktif)...</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-300/60">
                    STATUS: BELUM BAYAR
                  </span>
                </div>
              )}

              {qrisStep === 'detecting' && (
                <div className="bg-emerald-50 border border-[#00AA13]/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 animate-pulse">
                  <Loader2 className="w-4 h-4 text-[#00AA13] animate-spin shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-extrabold text-[#00AA13]">
                      Sinyal Pembayaran Diterima!
                    </p>
                    <p className="text-[10px] text-emerald-800 font-medium">
                      Memverifikasi mutasi transaksi dari Bank Indonesia / PJSP...
                    </p>
                  </div>
                </div>
              )}

              {qrisStep === 'verified' && (
                <div className="bg-[#E8F5E9] border-2 border-[#00AA13] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 animate-in zoom-in-95 duration-200">
                  <div className="w-7 h-7 rounded-full bg-[#00AA13] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#00AA13] flex items-center gap-1.5">
                      PEMBAYARAN QRIS TERVERIFIKASI!
                      <span className="bg-[#00AA13] text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono">
                        LUNAS
                      </span>
                    </p>
                    <p className="text-[10px] text-gray-700 font-semibold">
                      Pesanan Anda otomatis diubah ke status LUNAS. Mengalihkan ke tiket...
                    </p>
                  </div>
                </div>
              )}

              {/* QR Code Container with Scanner Laser & Interactive States */}
              <div className="relative flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 overflow-hidden">
                <p className="text-[11px] font-extrabold text-black uppercase mb-1">
                  ITEGO TRANSPORT LOMBOK & GILI
                </p>
                <p className="text-[9px] text-gray-500 mb-3 font-mono">
                  NMID: ID102026891001-ITEGO
                </p>

                {/* Scannable QR Matrix with Laser Beam */}
                <div className="relative p-3 bg-white rounded-2xl shadow-md border-2 border-[#00AA13] overflow-hidden">
                  
                  {/* Laser Beam Animation when waiting */}
                  {qrisStep === 'waiting' && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00AA13] to-transparent shadow-[0_0_10px_#00AA13] animate-qris-scan z-10 pointer-events-none" />
                  )}

                  {/* Verifying / Detected Overlay */}
                  {qrisStep === 'detecting' && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center">
                      <Loader2 className="w-8 h-8 text-[#00AA13] animate-spin mb-2" />
                      <p className="text-xs font-black text-black">Memverifikasi Mutasi...</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">Mencocokkan Nominal QRIS</p>
                    </div>
                  )}

                  {/* Verified Overlay */}
                  {qrisStep === 'verified' && (
                    <div className="absolute inset-0 bg-[#00AA13]/90 text-white z-20 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-white text-[#00AA13] flex items-center justify-center mb-2 shadow-lg">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>
                      <p className="text-xs font-black tracking-wider uppercase">LUNAS</p>
                      <p className="text-[10px] text-emerald-100 font-mono">Status: Terkonfirmasi</p>
                    </div>
                  )}

                  <svg
                    viewBox="0 0 160 160"
                    className="w-44 h-44 mx-auto"
                    fill="currentColor"
                  >
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="40" height="40" fill="#000000" rx="4" />
                    <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                    <rect x="24" y="24" width="12" height="12" fill="#000000" rx="1" />

                    <rect x="110" y="10" width="40" height="40" fill="#000000" rx="4" />
                    <rect x="118" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                    <rect x="124" y="24" width="12" height="12" fill="#000000" rx="1" />

                    <rect x="10" y="110" width="40" height="40" fill="#000000" rx="4" />
                    <rect x="18" y="118" width="24" height="24" fill="#ffffff" rx="2" />
                    <rect x="24" y="124" width="12" height="12" fill="#000000" rx="1" />

                    {/* QR Matrix Bits */}
                    <rect x="60" y="15" width="8" height="8" fill="#000000" />
                    <rect x="75" y="15" width="8" height="8" fill="#000000" />
                    <rect x="90" y="25" width="8" height="8" fill="#000000" />
                    <rect x="60" y="35" width="16" height="8" fill="#000000" />
                    
                    <rect x="15" y="60" width="8" height="16" fill="#000000" />
                    <rect x="30" y="70" width="12" height="8" fill="#000000" />
                    <rect x="15" y="85" width="16" height="8" fill="#000000" />

                    <rect x="115" y="60" width="12" height="8" fill="#000000" />
                    <rect x="135" y="75" width="12" height="12" fill="#000000" />
                    <rect x="120" y="95" width="16" height="8" fill="#000000" />

                    {/* Center Area Pattern */}
                    <rect x="55" y="55" width="50" height="50" fill="#ffffff" />
                    <rect x="60" y="60" width="40" height="40" fill="#00AA13" rx="8" />
                    <text x="80" y="86" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle">itego</text>

                    {/* Bottom Patterns */}
                    <rect x="60" y="115" width="12" height="12" fill="#000000" />
                    <rect x="80" y="120" width="16" height="8" fill="#000000" />
                    <rect x="105" y="115" width="8" height="16" fill="#000000" />
                    <rect x="125" y="130" width="16" height="8" fill="#000000" />
                    <rect x="65" y="135" width="25" height="8" fill="#000000" />
                  </svg>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">Nominal Pembayaran:</p>
                  <p className="text-2xl font-extrabold text-[#00AA13]">
                    {formatRupiah(bookingDraft.totalPrice)}
                  </p>
                </div>
              </div>

              {/* MOCK QRIS VERIFICATION PANEL */}
              <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#00AA13]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00AA13]" />
                    <span className="text-xs font-black text-black">
                      Simulasi Verifikasi QRIS Otomatis
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#00AA13] border border-[#00AA13]/30">
                    TEST & DEMO
                  </span>
                </div>

                {qrisStep === 'waiting' && (
                  <>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Klik tombol simulasi di bawah untuk menguji deteksi pembayaran masuk. Sistem akan memverifikasi mutasi bank dan otomatis mengubah status pesanan Anda menjadi <strong className="text-[#00AA13]">LUNAS</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => triggerSimulatedQrisPayment('BCA Mobile')}
                        className="flex-1 py-2.5 px-3 bg-[#00AA13] hover:bg-[#009310] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Simulasikan Bayar via m-Banking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerSimulatedQrisPayment('GoPay / ShopeePay')}
                        className="py-2.5 px-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#00AA13]" />
                        <span>Simulasi E-Wallet</span>
                      </button>
                    </div>

                    {/* Auto-simulate countdown footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[10px]">
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono">
                        <Radio className="w-3 h-3 text-[#00AA13] animate-pulse" />
                        <span>Auto-deteksi dalam: <strong className="text-black font-bold">{autoSimulateSeconds}s</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAutoSimulateActive(!isAutoSimulateActive)}
                        className="text-[10px] text-gray-500 hover:text-black font-semibold underline cursor-pointer"
                      >
                        {isAutoSimulateActive ? 'Jeda Auto-Deteksi' : 'Aktifkan Auto-Deteksi'}
                      </button>
                    </div>
                  </>
                )}

                {detectedTx && (
                  <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>REF NO: {detectedTx.refId}</span>
                      <span>{detectedTx.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-600 font-medium">Pengirim:</span>
                      <span className="font-extrabold text-black text-[11px]">{detectedTx.source}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-gray-600 font-medium">Nominal:</span>
                      <span className="font-extrabold text-[#00AA13]">{formatRupiah(detectedTx.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-1">
                      <span className="text-[11px] text-gray-600 font-medium">Status Pembayaran:</span>
                      <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-md ${
                        qrisStep === 'verified'
                          ? 'bg-[#E8F5E9] text-[#00AA13]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {qrisStep === 'verified' ? '● LUNAS (TERVERIFIKASI)' : '● MEMVERIFIKASI MUTASI'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-600 space-y-1 border border-gray-200">
                <p className="font-bold text-black">Panduan QRIS Asli:</p>
                <p>1. Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay).</p>
                <p>2. Arahkan kamera ke barcode di atas & selesaikan pembayaran.</p>
                <p>3. Sistem ITEGO akan otomatis memverifikasi mutasi tanpa perlu upload bukti struk.</p>
              </div>
            </div>
          )}

          {/* METHOD 2: BANK TRANSFER */}
          {paymentMethod === 'transfer_bank' && (
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 space-y-4">
              <p className="text-xs font-bold text-gray-700">Pilih Rekening Tujuan:</p>
              <div className="space-y-2">
                {BANK_ACCOUNTS.map((bank) => {
                  const isSelected = selectedBank.bankName === bank.bankName;
                  return (
                    <div
                      key={bank.bankName}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#E8F5E9] border-[#00AA13] shadow-xs'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-black">{bank.bankName}</p>
                          <p className="text-sm font-mono font-bold text-[#00AA13] tracking-wider mt-0.5">
                            {bank.accountNumber}
                          </p>
                          <p className="text-[10px] text-gray-500">a.n {bank.accountHolder}</p>
                        </div>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#00AA13] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Copy actions */}
              <div className="bg-gray-50 p-3.5 rounded-2xl space-y-2 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono">No. Rekening {selectedBank.bankName}:</span>
                    <p className="text-xs font-mono font-bold text-black">{selectedBank.accountNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedBank.accountNumber, 'bank')}
                    className="px-3 py-1.5 text-xs font-bold bg-white text-[#00AA13] border border-gray-300 rounded-xl hover:border-[#00AA13] flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5 text-[#00AA13]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBank ? 'Tersalin' : 'Salin Rekening'}
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono">Nominal Transfer:</span>
                    <p className="text-xs font-bold text-[#00AA13]">{formatRupiah(bookingDraft.totalPrice)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bookingDraft.totalPrice.toString(), 'amount')}
                    className="px-3 py-1.5 text-xs font-bold bg-white text-[#00AA13] border border-gray-300 rounded-xl hover:border-[#00AA13] flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    {copiedAmount ? <Check className="w-3.5 h-3.5 text-[#00AA13]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAmount ? 'Tersalin' : 'Salin Nominal'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* METHOD 3: CASH / TUNAI */}
          {paymentMethod === 'tunai' && (
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-black font-extrabold text-sm">
                <Banknote className="w-5 h-5 text-[#00AA13]" />
                Bayar Tunai Langsung di Tempat (COD)
              </div>
              <div className="bg-gray-50 p-3.5 rounded-2xl text-xs text-gray-600 space-y-2 border border-gray-200">
                <p>• <strong>Rental Sepeda Kayuh</strong>: Bayar saat unit sepeda diserahkan dan dicek bersama di Gili Trawangan.</p>
                <p>• <strong>Ojek Sepeda Listrik</strong>: Bayar setelah diantar sampai di tempat tujuan dengan aman.</p>
                <p>• <strong>Driver Mobil</strong>: Bayar tunai kepada driver saat bertemu di Pelabuhan Bangsal sebelum memulai perjalanan wisata.</p>
              </div>
              <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-[#00AA13]/30 flex items-center gap-2 text-xs text-[#00AA13] font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Tanpa uang muka (DP). Simpel, transparan, dan terpercaya.</span>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleManualComplete}
            className="btn-confirm-v16 w-full py-4 text-sm font-extrabold shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {qrisStep === 'detecting'
                  ? 'Memverifikasi Pembayaran Masuk...'
                  : qrisStep === 'verified'
                  ? 'Pembayaran Lunas! Menyiapkan Tiket...'
                  : 'Memproses Pesanan Anda...'}
              </span>
            ) : paymentMethod === 'tunai' ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                Konfirmasi Booking Tunai
              </>
            ) : paymentMethod === 'qris' ? (
              <>
                <Sparkles className="w-5 h-5" />
                Saya Sudah Bayar / Verifikasi Sekarang
              </>
            ) : (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                Saya Sudah Transfer / Selesaikan Pesanan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
