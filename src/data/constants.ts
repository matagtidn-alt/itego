import { FleetState, TourPackage } from '../types';

export const INITIAL_FLEET_STATE: FleetState = {
  totalBikes: 10,
  availableBikes: 8,
  bikePricePerDay: 50000,

  electricOjekTotal: 1,
  electricOjekStatus: 'ready',
  electricOjekPricePerTrip: 20000,
  electricOjekDriverName: 'Bang Rudi (Driver Sepeda Listrik Gili T)',
  electricOjekDriverPhone: '+6281234567890',

  carDriverTotal: 1,
  carDriverStatus: 'ready',
  carType: 'Toyota Avanza Veloz (AC Dingin, 6 Kursi + Bagasi)',
  carDriverName: 'Pak Wayan / Mas Hendra (Driver Lombok Timur)',
  carDriverPhone: '+6287890123456',
};

export const GILI_POPULAR_LOCATIONS = [
  'Pelabuhan Utama Gili Trawangan (Main Port)',
  'Sunset Point / Ombak Sunset (Pantai Barat)',
  'Turtle Point (Pantai Timur Snorkeling)',
  'Pasar Seni Night Market & Sentral',
  'Kawasan Resort Utara Gili Trawangan',
  'Aston Sunset Beach Resort',
  'Vila Ombak Gili Trawangan',
  'Gili Eco Villas',
  'Pojok Sunrise Point',
];

export const LOMBOK_TIMUR_TOURS: TourPackage[] = [
  {
    id: 'sembalun',
    title: 'Sembalun & Kaki Gunung Rinjani',
    duration: 'Full Day (8-10 Jam)',
    price: 450000,
    description: 'Wisata sejuk lereng Rinjani: Bukit Selong, Petik Stroberi Segar, Pusuk Pass Viewpoint, & Rumah Tradisional Desa Beleq.',
    highlights: ['Bukit Selong Panorama', 'Petik Buah Stroberi', 'Pusuk Pass Viewpoint', 'Hawa Sejuk Pegunungan'],
    imageBadge: 'Favorit Turis',
  },
  {
    id: 'tetebatu',
    title: 'Tetebatu Green Valley & Air Terjun',
    duration: 'Full Day (8-9 Jam)',
    price: 450000,
    description: 'Pesona lembah hijau persawahan terasering Tetebatu, Air Terjun Jeruk Manis / Sarang Walet, dan suasana asri kaki Rinjani selatan.',
    highlights: ['Terasering Sawah Hijau', 'Air Terjun Jeruk Manis', 'Hutan Monyet Hitam', 'Nuansa Desa Tradisional'],
    imageBadge: 'Wisata Alam Asri',
  },
  {
    id: 'pantai-pink',
    title: 'Pantai Pink (Tangsi) & Tanjung Ringgit',
    duration: 'Full Day (9-10 Jam)',
    price: 500000,
    description: 'Menuju pesona pasir merah muda eksotis di Lombok Timur selatan, tebing karang dramatis Tanjung Ringgit dan pemandangan samudra lepas.',
    highlights: ['Pasir Merah Muda Langka', 'Tebing Tanjung Ringgit', 'Spot Foto Instagrammable', 'Pemandangan Samudra'],
    imageBadge: 'Eksotis & Pantai',
  },
  {
    id: 'surf-korleko',
    title: 'Area Surf di Korleko & Labuhan Haji',
    duration: 'Full Day (7-8 Jam)',
    price: 400000,
    description: 'Spot ombak surfing tersembunyi favorit peselancar di pesisir Korleko & Labuhan Haji Lombok Timur. Tersedia ruang bagasi untuk papan selancar (surfboard).',
    highlights: ['Spot Ombak Surfing Korleko', 'Muat Papan Selancar (Surfboard)', 'Pantai Sunrise & Dermaga', 'Kuliner Ikan Bakar Segar'],
    imageBadge: 'Surfing Spot',
  },
  {
    id: 'custom-all-day',
    title: 'Trip Harian Bisa Request (Custom Bebas Seharian)',
    duration: '10 - 12 Jam Fleksibel',
    price: 650000,
    description: 'Bebas tentukan destinasi dan rute wisata di Lombok Timur sesuai keinginan Anda. Sudah termasuk Mobil ber-AC + Driver ramah + Bensin BBM seharian.',
    highlights: ['Bebas Request Destinasi', 'Rute Sesuai Keinginan', 'Driver & Guide Lokal', 'Include BBM & Parkir'],
    imageBadge: 'Bisa Request',
  },
];

export const BANK_ACCOUNTS = [
  {
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '0561928371',
    accountHolder: 'ITEGO TRANSPORT LOMBOK',
    logo: 'BCA',
  },
  {
    bankName: 'BRI (Bank Rakyat Indonesia)',
    accountNumber: '472101009876532',
    accountHolder: 'ITEGO TRANSPORT LOMBOK',
    logo: 'BRI',
  },
  {
    bankName: 'Bank Mandiri',
    accountNumber: '1610009823412',
    accountHolder: 'ITEGO TRANSPORT LOMBOK',
    logo: 'MANDIRI',
  },
  {
    bankName: 'BSI (Bank Syariah Indonesia)',
    accountNumber: '7182930412',
    accountHolder: 'ITEGO TRANSPORT LOMBOK',
    logo: 'BSI',
  },
];

export const INITIAL_BOOKINGS_STORAGE_KEY = 'itego_bookings_v1';
export const FLEET_STORAGE_KEY = 'itego_fleet_v1';
