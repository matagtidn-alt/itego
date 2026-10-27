import React from 'react';
import { Bike, Zap, Car } from 'lucide-react';
import { FleetState, ServiceType, Language } from '../types';
import { translations } from '../i18n/translations';

interface FleetStatusBannerProps {
  fleet: FleetState;
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
  language: Language;
}

export const FleetStatusBanner: React.FC<FleetStatusBannerProps> = ({
  fleet,
  selectedService,
  onSelectService,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-1">
        <span className="label-editorial">[02] {language === 'id' ? 'STATUS ARMADA & PILIH LAYANAN' : 'FLEET STATUS & SELECT SERVICE'}</span>
        <span className="font-mono text-[10px] text-[#111113]/60 uppercase tracking-widest">
          {t.fleetStatusArea}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Sepeda Kayuh */}
        <div
          onClick={() => onSelectService('rental_sepeda')}
          className={`card-editorial p-5 cursor-pointer transition-all ${
            selectedService === 'rental_sepeda'
              ? 'border-[#111113] shadow-[4px_4px_0px_#111113] ring-1 ring-[#111113]'
              : 'hover:border-[#111113]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#111113]">
              {language === 'id' ? 'Sepeda Kayuh' : 'Pedal Bike'}
            </h3>
            <Bike className="w-5 h-5 text-[#111113]" />
          </div>
          <p className="font-body text-xs text-[#111113]/70 font-medium">
            {fleet.availableBikes}/{fleet.totalBikes} {language === 'id' ? 'Unit Siap Sewa' : 'Units Available'}
          </p>
          <p className="font-mono text-sm font-bold text-[#E8652D] mt-3">
            Rp 50k / Day
          </p>
        </div>

        {/* 2. Ojek Listrik */}
        <div
          onClick={() => onSelectService('ojek_listrik')}
          className={`card-editorial p-5 cursor-pointer transition-all ${
            selectedService === 'ojek_listrik'
              ? 'border-[#111113] shadow-[4px_4px_0px_#111113] ring-1 ring-[#111113]'
              : 'hover:border-[#111113]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#111113]">
              {language === 'id' ? 'Ojek Listrik' : 'E-Bike Taxi'}
            </h3>
            <Zap className="w-5 h-5 text-[#111113] fill-current" />
          </div>
          <p className="font-body text-xs text-[#111113]/70 font-medium">
            1 Unit ({fleet.electricOjekStatus === 'ready' ? (language === 'id' ? 'Siap Antar' : 'Available') : (language === 'id' ? 'Sedang Jalan' : 'Busy')})
          </p>
          <p className="font-mono text-sm font-bold text-[#E8652D] mt-3">
            Rp 20k / Trip
          </p>
        </div>

        {/* 3. Driver Mobil */}
        <div
          onClick={() => onSelectService('driver_mobil')}
          className={`card-editorial p-5 cursor-pointer transition-all ${
            selectedService === 'driver_mobil'
              ? 'border-[#111113] shadow-[4px_4px_0px_#111113] ring-1 ring-[#111113]'
              : 'hover:border-[#111113]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#111113]">
              {language === 'id' ? 'Mobil Driver' : 'Private Car'}
            </h3>
            <Car className="w-5 h-5 text-[#111113]" />
          </div>
          <p className="font-body text-xs text-[#111113]/70 font-medium">
            {language === 'id' ? 'Jemput Pelabuhan Bangsal' : 'Bangsal Port Pickup'}
          </p>
          <p className="font-mono text-sm font-bold text-[#E8652D] mt-3">
            Mulai Rp 400k (Full AC)
          </p>
        </div>
      </div>
    </div>
  );
};
