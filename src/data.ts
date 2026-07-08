import salonHero from './assets/images/salon_hero_1783511762234.jpg';
import salonReception from './assets/images/salon_reception_1783511785848.jpg';
import salonSkincare from './assets/images/salon_skincare_1783511804014.jpg';
import salonPedicure from './assets/images/salon_pedicure_1783511820694.jpg';
import salonHair from './assets/images/salon_hair_1783511837383.jpg';

export const SALON_IMAGES = {
  hero: salonHero,
  reception: salonReception,
  skincare: salonSkincare,
  pedicure: salonPedicure,
  hair: salonHair,
};

export interface Branch {
  id: string;
  name: string;
  city: string;
  rating: string;
  reviews: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  plusCode?: string;
  callLink: string;
  whatsappLink: string;
  highlights: string[];
}

export const BRANCHES: Branch[] = [
  {
    id: 'burewala',
    name: 'TR Signature Salon Burewala',
    city: 'Burewala',
    rating: '4.5',
    reviews: '366',
    category: 'Beauty Salon',
    address: 'Defence Road, Burewala, Pakistan',
    phone: '+92 67 3353535',
    hours: 'Monday to Sunday, 10 AM – 8 PM',
    callLink: 'tel:+92673353535',
    whatsappLink: 'https://wa.me/92673353535',
    highlights: [
      'Premium beauty salon in Burewala',
      'Hydra facial, keratin, bridal makeup, manicure and pedicure',
      'Appointments recommended',
      'Cash-only payments'
    ]
  },
  {
    id: 'vehari',
    name: 'TR Signature Salon Vehari',
    city: 'Vehari',
    rating: '4.5',
    reviews: '216',
    category: 'Beauty Salon',
    address: 'House no 816 Street no 1, near SK Mall, Defence View Housing, Vehari, 61100, Pakistan',
    phone: '+92 333 3336442',
    hours: 'Opens 10 AM',
    plusCode: '397J+92 Vehari, Pakistan',
    callLink: 'tel:+923333336442',
    whatsappLink: 'https://wa.me/923333336442',
    highlights: [
      'Premium beauty salon in Vehari',
      'Known for cooperative staff and relaxing environment',
      'Hydrafacial, mani-pedi, haircut, balayage and gold facial',
      'Professional salon services near SK Mall'
    ]
  }
];

export interface Service {
  id: string;
  name: string;
  category: 'Hair' | 'Skincare' | 'Nails & Spa' | 'Makeup & Laser';
  description: string;
  price?: string;
}

export interface Deal {
  id: string;
  title: string;
  price: number;
  category: 'skin_hair' | 'laser_body';
  items: string[];
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  serviceMentioned: string;
  stylist?: string;
  date: string;
  branch?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Reception' | 'Hair Styling Area' | 'Facial Room' | 'Pedicure Area' | 'Interior' | 'Exterior';
  image: string;
}

export const SERVICES: Service[] = [
  // Hair Services
  {
    id: 'haircut',
    name: 'Haircuts & Styling',
    category: 'Hair',
    description: 'Expert personalized haircuts in Burewala and professional haircut Vehari services, including trimming, layer cuts, bob cuts, flick cuts, and custom style consulting tailored to your facial structure.',
  },
  {
    id: 'hairwash',
    name: 'Hair Wash & Blow Dry',
    category: 'Hair',
    description: 'Refreshing deep-cleansing hair wash using premium salon-grade shampoos and conditioners, followed by a professional heat-styled blow dry.',
  },
  {
    id: 'haircolor',
    name: 'Hair Coloring, Highlights & Balayage',
    category: 'Hair',
    description: 'Full hair transformation with premium, ammonia-free hair colors, beautiful highlights, streaks, lowlights, or hand-painted balayage Vehari and Burewala styles for rich dimensions.',
  },
  {
    id: 'keratin',
    name: 'Keratin & Nanoplastia Hair Treatments',
    category: 'Hair',
    description: 'Pro keratin treatment Burewala services and premium Nanoplastia treatments to eliminate frizz, restore hair structure, and deliver long-lasting, silky-smooth, glossy hair.',
  },
  
  // Skincare Services
  {
    id: 'hydra-facial',
    name: 'Hydra Facial (7 & 10 Tools)',
    category: 'Skincare',
    description: 'Multi-step advanced non-invasive hydra facial Burewala and hydra facial Vehari treatments combining deep cleansing, exfoliation, extraction, hydration, and antioxidant protection using specialized tools.',
  },
  {
    id: 'dermacos',
    name: 'Dermacos Facial',
    category: 'Skincare',
    description: 'Clinical-grade skincare facial focusing on deep-pore cleansing, customized skin polishing, exfoliation, blackhead removing, and protective face masking.',
  },
  {
    id: 'whitening-facial',
    name: 'Whitening Facial',
    category: 'Skincare',
    description: 'Specially formulated brightening facial and premium gold facial Vehari and Burewala treatments that help reduce hyperpigmentation, uneven skin tone, and dullness, revealing a fresh and radiant glow.',
  },
  {
    id: 'acne-treatment',
    name: 'Acne Treatment',
    category: 'Skincare',
    description: 'Targeted skin treatment designed to deep-clean pores, regulate excess oil, reduce active acne inflammation, and help soothe acne-prone skin with cooling masks.',
  },
  {
    id: 'skin-glow',
    name: 'Skin Glow & Skin Tightening',
    category: 'Skincare',
    description: 'Anti-aging and skin rejuvenating treatment designed to stimulate collagen, tighten loose skin, close open pores, and boost natural radiance.',
  },
  {
    id: 'blackhead-removing',
    name: 'Blackhead Removing',
    category: 'Skincare',
    description: 'Gentle and professional extraction of blackheads and whiteheads, clearing up clogged pores and smoothing out your skin texture.',
  },

  // Nails & Spa
  {
    id: 'mani-pedi',
    name: 'Manicure & Pedicure',
    category: 'Nails & Spa',
    description: 'Luxurious pampering with premium manicure and relaxing mani pedi Vehari and Burewala techniques. Includes nail clipping, shaping, cuticle care, scrub exfoliation, soothing hand & foot massages, and detailed cleaning.',
  },
  {
    id: 'polisher',
    name: 'Hand & Feet Polisher',
    category: 'Nails & Spa',
    description: 'Advanced polishing treatment for hands and feet to exfoliate dead skin, reduce tanning, and instantly brighten your hands and feet.',
  },
  {
    id: 'massage',
    name: 'Massage Services',
    category: 'Nails & Spa',
    description: 'Stress-relieving professional full-body massage, shoulder massage, and facial relaxation therapies designed to ease tension and improve circulation.',
  },
  {
    id: 'nails',
    name: 'Nail Services & Art',
    category: 'Nails & Spa',
    description: 'Professional nail grooming, filing, detailed shaping, custom nail coloring, and beautiful, minimalist nail art designs.',
  },

  // Makeup & Laser
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    category: 'Makeup & Laser',
    description: 'Our signature bridal makeup Burewala and bridal makeup Vehari packages, custom designed to make you look breathtakingly beautiful, radiant, and timeless on your special day. Highly customized.',
  },
  {
    id: 'party-makeup',
    name: 'Party Makeup',
    category: 'Makeup & Laser',
    description: 'Stunning look for any special event, wedding guest appearance, or celebratory gathering, using high-definition, premium long-lasting cosmetic brands.',
  },
  {
    id: 'laser-hair',
    name: 'Face Hair Removal with Laser',
    category: 'Makeup & Laser',
    description: 'Professional facial laser hair removal service performed with care and cooling comfort. Individual results may vary, and consultation is recommended before booking.',
  }
];

export const DEALS: Deal[] = [
  // Skin & Hair Deals
  {
    id: 'sh-deal-1',
    title: 'Skin & Hair Deal 1',
    price: 2000,
    category: 'skin_hair',
    items: [
      'Whitening Facial',
      'Whitening Cleansing',
      'Whitening Scrubbing',
      'Whitening Mask',
      'Blackhead Remover',
      'Shoulder Massage',
      'Simple Hair Wash',
      'Blow Dry'
    ]
  },
  {
    id: 'sh-deal-2',
    title: 'Skin & Hair Deal 2',
    price: 1500,
    category: 'skin_hair',
    items: [
      'Whitening Manicure',
      'Whitening Pedicure',
      'Hand Polisher',
      'Feet Polisher',
      'Nail Cleaning',
      'Nail Shaping',
      'Hand Massage',
      'Feet Massage',
      'Hair Trimming',
      'Blow Dry'
    ]
  },
  {
    id: 'sh-deal-3',
    title: 'Skin & Hair Deal 3',
    price: 2500,
    category: 'skin_hair',
    items: [
      'Dermacose Facial',
      'Dermacose Cleansing',
      'Dermacose Polisher',
      'Dermacose Scrubbing',
      'Blackhead Removing',
      'Shoulder Massage',
      'Dermacose Mask',
      'Flick Cut'
    ]
  },
  {
    id: 'sh-deal-4',
    title: 'Skin & Hair Deal 4',
    price: 1500,
    category: 'skin_hair',
    items: [
      'Hair Wash',
      'Hair Cut (Any Cut)',
      'Hair Chopping',
      'Blow Dry'
    ]
  },
  {
    id: 'sh-deal-5',
    title: 'Skin & Hair Deal 5',
    price: 1000,
    category: 'skin_hair',
    items: [
      'Hair Oiling',
      'Head Massage',
      'Hair Wash',
      'Cool Dry'
    ]
  },
  {
    id: 'sh-deal-6',
    title: 'Skin & Hair Deal 6 (Coloring Special)',
    price: 10000,
    category: 'skin_hair',
    items: [
      'Highlights / Lowlights / Streaks / Balayage / Ombre',
      'Hair Glossing',
      'Hair Wash',
      'Blow Dry'
    ]
  },
  {
    id: 'sh-deal-7',
    title: 'Skin & Hair Deal 7 (Pro Keratin)',
    price: 12000,
    category: 'skin_hair',
    items: [
      'Pro Keratin Treatment',
      'Deep Hair Wash',
      'Hair Keratin Application',
      '3rd Day Wash & Finish',
      'Hair Trimming',
      'Blow Dry Styling'
    ]
  },
  {
    id: 'sh-deal-8',
    title: 'Skin & Hair Deal 8 (Same Day Keratin)',
    price: 14000,
    category: 'skin_hair',
    items: [
      'Same Day Keratin Treatment',
      'Deep Hair Wash',
      'Hair Keratin Application',
      'Same Day Wash & Seal',
      'Hair Trimming',
      'Blow Dry Styling'
    ]
  },
  {
    id: 'sh-deal-9',
    title: 'Skin & Hair Deal 9 (Nanoplastia)',
    price: 15000,
    category: 'skin_hair',
    items: [
      'Nanoplastia Hair Treatment',
      'Deep Hair Wash',
      'Premium Nanoplastia Application',
      'Same Day Wash & Seal',
      'Hair Trimming',
      'Blow Dry Styling'
    ]
  },

  // Laser & Body Deals
  {
    id: 'lb-deal-1',
    title: 'Laser & Body Deal 1',
    price: 3000,
    category: 'laser_body',
    items: [
      'Full Body Massage',
      'Face Relaxing Massage',
      'Nail Filing'
    ]
  },
  {
    id: 'lb-deal-2',
    title: 'Laser & Body Deal 2',
    price: 3000,
    category: 'laser_body',
    items: [
      'Double Chin Treatment',
      'Manicure',
      'Pedicure',
      'Hand & Feet Polisher',
      'Nail Cleaning',
      'Scrubbing',
      'Hand & Feet Mask',
      'Relaxing Massage'
    ]
  },
  {
    id: 'lb-deal-3',
    title: 'Laser & Body Deal 3 (Carbon Facial Special)',
    price: 3500,
    category: 'laser_body',
    items: [
      'Carbon Facial Therapy',
      'Face Cleaning',
      'Acne Treatment',
      'Face Scrubbing',
      'Face Cleansing',
      'Blackhead Removing',
      'Pores Shrink Treatment',
      'Carbon Cream Application',
      'Cooling Therapy Mask',
      'Hand & Feet Polisher'
    ]
  },
  {
    id: 'lb-deal-4',
    title: 'Laser & Body Deal 4',
    price: 3500,
    category: 'laser_body',
    items: [
      'Acne Treatment',
      'Skin Cleansing',
      'Skin Glow Polish',
      'Blackhead Removing',
      'Skin Relaxing Massage',
      'Cooling Therapy Mask',
      'Hand Polisher',
      'Feet Polisher',
      'Nail Color'
    ]
  },
  {
    id: 'lb-deal-5',
    title: 'Laser & Body Deal 5 (Hydra 7 Tools)',
    price: 3000,
    category: 'laser_body',
    items: [
      'Hydra Facial 7 Tools',
      'Deep Skin Cleansing',
      'Skin Glow Infusion',
      'Blackhead Removing',
      'Double Tone Skin Treatment',
      'Skin Tightening Therapy',
      'Pores Closing Therapy',
      'Eye Refreshing Treatment',
      'Nourishing Face Mask'
    ]
  },
  {
    id: 'lb-deal-6',
    title: 'Laser & Body Deal 6 (Hydra 10 Tools)',
    price: 4000,
    category: 'laser_body',
    items: [
      'Hydra Facial 10 Advanced Tools',
      'Acne Treatment',
      'Scar Reduction Treatment',
      'Open Pores Treatment',
      'Skin Tightening Treatment',
      'Blackhead Removing',
      'Freckles Brightening Treatment'
    ]
  },
  {
    id: 'lb-deal-7',
    title: 'Laser & Body Deal 7 (Laser Hair)',
    price: 2500,
    category: 'laser_body',
    items: [
      'Face Hair Removal with Laser (State-of-the-art precise cooling technology)'
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ayesha Khan',
    rating: 5,
    text: "Absolutely loved the hair service! Dua is extremely talented, and her work is flawless. She listened to exactly what I wanted and the blow dry stayed gorgeous for days. Highly recommended stylist!",
    serviceMentioned: 'Hair Cut & Blow Dry',
    stylist: 'Dua',
    date: 'June 2026',
    branch: 'Burewala'
  },
  {
    id: 'rev-2',
    customerName: 'Zainab Bibi',
    rating: 5,
    text: "Had an amazing Long Bob haircut. The staff is so professional and polite. The salon interior is very luxurious and clean. Definitely the best beauty salon in Burewala!",
    serviceMentioned: 'Long Bob Haircut',
    stylist: 'Senior Stylist',
    date: 'July 2026',
    branch: 'Burewala'
  },
  {
    id: 'rev-3',
    customerName: 'Sana Fatima',
    rating: 5,
    text: "Highly satisfied with their whitening manicure, pedicure, and hand/feet polisher services. My tanning was visibly reduced, and the relaxing massage at the end was pure heaven. Truly premium environment.",
    serviceMentioned: 'Manicure, Pedicure & Polisher',
    stylist: 'Spa Specialist',
    date: 'May 2026',
    branch: 'Burewala'
  },
  {
    id: 'rev-4',
    customerName: 'Fatima N.',
    rating: 5,
    text: "The Hydra Facial 10 Tools is a must-try! It cleared up my blackheads and shrunk my pores immediately. My skin has never glowed like this before. Excellent hygiene standard.",
    serviceMentioned: 'Hydra Facial 10 Tools',
    stylist: 'Skin Expert',
    date: 'July 2026',
    branch: 'Burewala'
  },
  {
    id: 'rev-vehari-1',
    customerName: 'Zaini',
    rating: 5,
    text: "I visited TR Signature Salon Vehari for a makeover and relaxation session. The location was aesthetic, the mani-pedi was relaxing, and the haircut was exactly what I wanted. The staff was cooperative and professional.",
    serviceMentioned: 'Mani-Pedi & Haircut',
    date: 'June 2026',
    branch: 'Vehari'
  },
  {
    id: 'rev-vehari-2',
    customerName: 'Asia Qadeer',
    rating: 5,
    text: "I had balayage hair treatment and a gold facial at TR Signature Salon Vehari. The staff was polite, professional, and made sure I felt comfortable throughout the service.",
    serviceMentioned: 'Balayage & Gold Facial',
    date: 'July 2026',
    branch: 'Vehari'
  },
  {
    id: 'rev-vehari-3',
    customerName: 'Rana Aleem',
    rating: 5,
    text: "I got my Hydra Facial from TR Signature Salon Vehari and the experience was amazing. The environment was good and the service was done with care.",
    serviceMentioned: 'Hydra Facial',
    date: 'July 2026',
    branch: 'Vehari'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-reception',
    title: 'TR Signature Welcome & Reception Area',
    category: 'Reception',
    image: SALON_IMAGES.reception,
  },
  {
    id: 'gal-hair',
    title: 'Premium Hair Styling and Coloring Area',
    category: 'Hair Styling Area',
    image: SALON_IMAGES.hair,
  },
  {
    id: 'gal-skincare',
    title: 'Advanced Hydra Facial & Skincare Treatment Room',
    category: 'Facial Room',
    image: SALON_IMAGES.skincare,
  },
  {
    id: 'gal-pedicure',
    title: 'Relaxing Manicure & Pedicure Spa Station',
    category: 'Pedicure Area',
    image: SALON_IMAGES.pedicure,
  },
  {
    id: 'gal-interior',
    title: 'Luxury Salon General Interior & Styling Stations',
    category: 'Interior',
    image: SALON_IMAGES.hero,
  },
  {
    id: 'gal-exterior',
    title: 'Elegantly Designed Salon Front Entrance',
    category: 'Exterior',
    image: SALON_IMAGES.hero,
  }
];
