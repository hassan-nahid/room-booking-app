// backend/src/scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Property } from '../models/property.model.js';
import { Booking } from '../models/booking.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Real users data for testing
const usersData = [
  {
    firstName: 'Hassan',
    lastName: 'Nahid',
    email: 'hassan.nahid.dev@gmail.com',
    password: 'StrongP@ss1',
    phone: '+8801780365440',
    role: 'host',
    isHost: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Passionate full-stack developer turned hospitality expert. I\'ve been hosting for over 4 years and absolutely love creating memorable experiences for travelers from around the world. When I\'m not coding, you\'ll find me exploring local hidden gems to recommend to my guests!',
    dateOfBirth: new Date('1990-03-15'),
    address: {
      street: '1234 Tech Street, Apt 5B',
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh',
      zipCode: '1000'
    },
    hostInfo: {
      joinedDate: new Date('2020-01-15'),
      isSuperhost: true,
      responseRate: 98,
      responseTime: 'within an hour',
      totalListings: 8,
      totalReviews: 247,
      averageRating: 4.9,
      languages: ['English', 'Bengali', 'Hindi'],
      verifications: ['email', 'phone', 'government_id', 'reviews', 'work_email']
    },
    preferences: {
      currency: 'BDT',
      language: 'English',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  },
  {
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.rodriguez@gmail.com',
    password: 'SecurePass123',
    phone: '+14155552001',
    role: 'host',
    isHost: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Licensed real estate professional with over 15 years of experience in luxury hospitality. I own and manage a portfolio of premium properties across California. My mission is to provide five-star experiences that exceed expectations. I speak fluent English and Spanish, and I\'m always available to help make your stay unforgettable. Fun fact: I\'m also a certified sommelier and love sharing local wine recommendations!',
    dateOfBirth: new Date('1985-07-22'),
    address: {
      street: '456 Luxury Lane, Suite 12A',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      zipCode: '94102'
    },
    hostInfo: {
      joinedDate: new Date('2019-03-10'),
      isSuperhost: true,
      responseRate: 99,
      responseTime: 'within an hour',
      totalListings: 12,
      totalReviews: 384,
      averageRating: 4.95,
      languages: ['English', 'Spanish', 'Portuguese'],
      verifications: ['email', 'phone', 'government_id', 'reviews', 'work_email']
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  },
  {
    firstName: 'Jessica',
    lastName: 'Chen',
    email: 'jessica.chen@outlook.com',
    password: 'MyPass2024!',
    phone: '+16195551234',
    role: 'guest',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    bio: 'Digital nomad and travel enthusiast with a passion for discovering unique places and connecting with local hosts! I work remotely as a UX designer, which allows me to explore the world while creating amazing user experiences. I love staying in authentic local accommodations rather than hotels because it gives me a real taste of the culture. When I\'m not working, you\'ll find me hiking, trying local cuisine, or capturing memories through photography. I\'m always respectful of host properties and love leaving positive reviews!',
    dateOfBirth: new Date('1992-08-15'),
    address: {
      street: '2468 Nomad Street, Apt 7A',
      city: 'San Diego',
      state: 'California',
      country: 'United States',
      zipCode: '92101'
    },
    guestInfo: {
      totalTrips: 23,
      memberSince: new Date('2021-05-10')
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim.host@yahoo.com',
    password: 'HostLife456',
    phone: '+12135559876',
    role: 'host',
    isHost: true,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Architect by profession, host by passion! I recently started my Airbnb journey and I\'m absolutely loving it. My background in architecture helps me create beautifully designed, functional spaces that guests adore. I specialize in modern, minimalist designs with Korean-inspired touches. As a relatively new host, I\'m extra attentive to every detail to ensure my guests have an amazing experience. I\'m fluent in English and Korean, and I love sharing insider tips about LA\'s best Korean BBQ spots!',
    dateOfBirth: new Date('1991-11-08'),
    address: {
      street: '789 Design Avenue, Unit 3C',
      city: 'Los Angeles',
      state: 'California',
      country: 'United States',
      zipCode: '90028'
    },
    hostInfo: {
      joinedDate: new Date('2023-01-20'),
      isSuperhost: false,
      responseRate: 94,
      responseTime: 'within a few hours',
      totalListings: 3,
      totalReviews: 28,
      averageRating: 4.7,
      languages: ['English', 'Korean', 'Japanese'],
      verifications: ['email', 'phone', 'government_id']
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  {
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos.travel@gmail.com',
    password: 'TravelLove789',
    phone: '+13105557890',
    role: 'guest',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Professional travel blogger and photographer with over 100,000 followers! I\'m always on the hunt for unique, Instagram-worthy places that tell a story. My blog \'Wanderlust Diaries\' features hidden gems and authentic local experiences from around the world. I have a keen eye for beautiful spaces and love supporting hosts who put thought into their property design. As a content creator, I often feature amazing Airbnb stays on my social media (with host permission, of course!). I\'m clean, respectful, and always leave detailed, helpful reviews.',
    dateOfBirth: new Date('1988-12-03'),
    address: {
      street: '1357 Blogger Boulevard, Studio 9',
      city: 'Los Angeles',
      state: 'California',
      country: 'United States',
      zipCode: '90210'
    },
    guestInfo: {
      totalTrips: 87,
      memberSince: new Date('2019-11-22')
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Thompson',
    email: 'robert.thompson.biz@gmail.com',
    password: 'Business2024',
    phone: '+14155558765',
    role: 'guest',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    bio: 'Senior business consultant specializing in digital transformation for Fortune 500 companies. I travel 200+ days per year for work, so I really appreciate hosts who understand the needs of business travelers. I value clean, professional accommodations with excellent Wi-Fi, comfortable workspaces, and quiet environments for client calls. I\'m extremely respectful of properties, often leave early and return late due to meetings, and always provide honest, detailed reviews. Despite my busy schedule, I love connecting with hosts and learning about local business culture!',
    dateOfBirth: new Date('1985-06-20'),
    address: {
      street: '951 Corporate Plaza, Suite 2100',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      zipCode: '10001'
    },
    guestInfo: {
      totalTrips: 156,
      memberSince: new Date('2018-03-14')
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      notifications: {
        email: true,
        sms: true,
        push: false
      }
    }
  }
];

// Sample properties data
const propertiesData = [
  {
    title: 'Stunning Beach House with Ocean Views',
    description: 'Wake up to breathtaking ocean views in this beautifully designed beach house. Perfect for families and groups looking for a luxurious coastal getaway. Features modern amenities, private beach access, and spectacular sunsets.',
    images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
    ],
    pricePerNight: 285,
    currency: 'USD',
    propertyType: 'house',
    category: 'entire_home',
    styleCategory: 'beach',
    address: {
      street: '123 Ocean Drive',
      city: 'Malibu',
      state: 'CA',
      country: 'USA',
      zipCode: '90265',
      coordinates: {
        latitude: 34.0259,
        longitude: -118.7798
      }
    },
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 5,
    amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'air_conditioning', 'pool', 'beachfront', 'ocean_view', 'free_parking', 'bbq_grill'],
    houseRules: ['No smoking', 'No parties', 'No pets', 'Check-in after 3 PM', 'Check-out before 11 AM'],
    instantBook: true,
    minimumStay: 2,
    maximumStay: 30,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['great_location', 'highly_rated', 'spacious']
  },
  {
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Escape to this charming mountain cabin surrounded by towering pine trees. Perfect for nature lovers, featuring a hot tub, fireplace, and hiking trails right outside your door.',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    pricePerNight: 165,
    currency: 'USD',
    propertyType: 'cabin',
    category: 'entire_home',
    styleCategory: 'cabins',
    address: {
      street: '456 Pine Ridge Road',
      city: 'Big Bear',
      state: 'CA',
      country: 'USA',
      zipCode: '92315',
      coordinates: {
        latitude: 34.2439,
        longitude: -116.9114
      }
    },
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    beds: 4,
    amenities: ['wifi', 'kitchen', 'heating', 'hot_tub', 'free_parking', 'bbq_grill', 'mountain_view', 'indoor_fireplace'],
    houseRules: ['No smoking indoors', 'No parties', 'Pets allowed with fee', 'Quiet hours 10 PM - 8 AM'],
    instantBook: false,
    minimumStay: 2,
    maximumStay: 14,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['great_location', 'highly_rated']
  },
  {
    title: 'Modern Downtown Loft',
    description: 'Stylish loft in the heart of downtown with floor-to-ceiling windows and city views. Walking distance to restaurants, shops, and nightlife. Perfect for business travelers and urban explorers.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    pricePerNight: 125,
    currency: 'USD',
    propertyType: 'loft',
    category: 'entire_home',
    styleCategory: 'iconic_cities',
    address: {
      street: '789 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90012',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'air_conditioning', 'heating', 'dedicated_workspace', 'gym', 'elevator'],
    houseRules: ['No smoking', 'No parties', 'No pets', 'Check-in after 4 PM'],
    instantBook: true,
    minimumStay: 1,
    maximumStay: 30,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['fast_wifi', 'great_location', 'self_checkin']
  },
  {
    title: 'Luxury Villa with Amazing Pool',
    description: 'Spectacular luxury villa featuring an infinity pool, panoramic views, and premium amenities. Perfect for special occasions and group getaways. Chef services available upon request.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    ],
    pricePerNight: 450,
    currency: 'USD',
    propertyType: 'villa',
    category: 'entire_home',
    styleCategory: 'luxe',
    address: {
      street: '321 Hillside Drive',
      city: 'Beverly Hills',
      state: 'CA',
      country: 'USA',
      zipCode: '90210',
      coordinates: {
        latitude: 34.0901,
        longitude: -118.4065
      }
    },
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 5,
    beds: 8,
    amenities: ['wifi', 'kitchen', 'washer', 'dryer', 'air_conditioning', 'pool', 'hot_tub', 'free_parking', 'bbq_grill', 'gym', 'mountain_view'],
    houseRules: ['No smoking', 'Events allowed with approval', 'No pets', 'Professional cleaning required'],
    instantBook: false,
    minimumStay: 3,
    maximumStay: 14,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['spacious', 'great_location', 'highly_rated']
  },
  {
    title: 'Charming Private Room in Shared House',
    description: 'Comfortable private room in a beautiful shared house. Great for solo travelers and those looking to meet new people. Shared kitchen and living areas with friendly housemates.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ],
    pricePerNight: 65,
    currency: 'USD',
    propertyType: 'house',
    category: 'private_room',
    styleCategory: 'countryside',
    address: {
      street: '654 Elm Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94102',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    amenities: ['wifi', 'kitchen', 'washer', 'heating', 'dedicated_workspace'],
    houseRules: ['No smoking', 'No parties', 'Pets allowed', 'Respect shared spaces'],
    instantBook: true,
    minimumStay: 1,
    maximumStay: 30,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['great_value', 'great_location']
  },
  {
    title: 'Unique Treehouse Experience',
    description: 'Sleep among the trees in this incredible treehouse! A truly unique experience with modern amenities and stunning forest views. Perfect for nature lovers and adventure seekers.',
    images: [
      'https://images.unsplash.com/photo-1441829266145-6d4bbc4a79ce?w=800',
      'https://images.unsplash.com/photo-1500207618330-acc0b2fb7c20?w=800'
    ],
    pricePerNight: 195,
    currency: 'USD',
    propertyType: 'treehouse',
    category: 'entire_home',
    styleCategory: 'treehouses',
    address: {
      street: '987 Forest Lane',
      city: 'Mendocino',
      state: 'CA',
      country: 'USA',
      zipCode: '95460',
      coordinates: {
        latitude: 39.3074,
        longitude: -123.8017
      }
    },
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    amenities: ['wifi', 'heating', 'hot_tub', 'bbq_grill', 'garden_view'],
    houseRules: ['No smoking', 'No parties', 'No children under 12', 'Respect nature'],
    instantBook: false,
    minimumStay: 2,
    maximumStay: 7,
    availableFrom: new Date('2024-03-01'),
    availableTo: new Date('2024-11-30'),
    highlights: ['unique_space', 'rare_find', 'experienced_host']
  },
  {
    title: 'Lakefront Cottage with Dock',
    description: 'Peaceful lakefront cottage with private dock and boat access. Wake up to serene water views and enjoy swimming, fishing, and water sports right at your doorstep.',
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    pricePerNight: 145,
    currency: 'USD',
    propertyType: 'cottage',
    category: 'entire_home',
    styleCategory: 'lakefront',
    address: {
      street: '159 Lakeshore Drive',
      city: 'Lake Tahoe',
      state: 'CA',
      country: 'USA',
      zipCode: '96150',
      coordinates: {
        latitude: 39.0968,
        longitude: -120.0324
      }
    },
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    beds: 4,
    amenities: ['wifi', 'kitchen', 'washer', 'heating', 'free_parking', 'bbq_grill', 'lake_view', 'lake_access'],
    houseRules: ['No smoking', 'No parties', 'Pets allowed', 'Life jackets required for water activities'],
    instantBook: true,
    minimumStay: 2,
    maximumStay: 14,
    availableFrom: new Date('2024-04-01'),
    availableTo: new Date('2024-10-31'),
    highlights: ['great_location', 'spacious', 'highly_rated']
  },
  {
    title: 'Tiny House on Wheels',
    description: 'Experience minimalist living in this beautifully designed tiny house. Compact yet comfortable with all essential amenities. Perfect for couples seeking a unique and sustainable stay.',
    images: [
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
    ],
    pricePerNight: 85,
    currency: 'USD',
    propertyType: 'other',
    category: 'entire_home',
    styleCategory: 'tiny_homes',
    address: {
      street: '753 Green Valley Road',
      city: 'Sebastopol',
      state: 'CA',
      country: 'USA',
      zipCode: '95472',
      coordinates: {
        latitude: 38.4022,
        longitude: -122.8236
      }
    },
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    amenities: ['wifi', 'kitchen', 'heating', 'free_parking', 'garden_view'],
    houseRules: ['No smoking', 'No parties', 'No pets', 'Minimal waste policy'],
    instantBook: true,
    minimumStay: 1,
    maximumStay: 7,
    availableFrom: new Date('2024-01-01'),
    availableTo: new Date('2025-12-31'),
    highlights: ['unique_space', 'great_value', 'sparkling_clean']
  }
];

// Sample bookings data
const bookingsData = [
  {
    checkIn: new Date('2024-12-01'),
    checkOut: new Date('2024-12-05'),
    numberOfGuests: 4,
    numberOfNights: 4,
    pricePerNight: 285,
    subtotal: 1140, // 4 nights * $285
    bookingFee: 57,
    cleaningFee: 75,
    taxes: 91.2,
    totalAmount: 1363.2,
    status: 'confirmed',
    paymentStatus: 'paid',
    guestDetails: {
      adults: 4,
      children: 0,
      infants: 0
    },
    specialRequests: 'Late check-in requested'
  },
  {
    checkIn: new Date('2024-11-15'),
    checkOut: new Date('2024-11-18'),
    numberOfGuests: 2,
    numberOfNights: 3,
    pricePerNight: 165,
    subtotal: 495, // 3 nights * $165 
    bookingFee: 24.75,
    cleaningFee: 50,
    taxes: 45.58,
    totalAmount: 615.33,
    status: 'confirmed',
    paymentStatus: 'paid',
    guestDetails: {
      adults: 2,
      children: 0,
      infants: 0
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});

    console.log('👥 Creating users...');
    const users = [];
    for (const userData of usersData) {
      const user = new User({
        ...userData
      });
      await user.save();
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    console.log('🏠 Creating properties...');
    const properties = [];
    for (let i = 0; i < propertiesData.length; i++) {
      const propertyData = propertiesData[i];
      const hostIndex = i % 2; // Alternate between first two hosts
      const property = new Property({
        ...propertyData,
        host: users[hostIndex]._id
      });
      await property.save();
      properties.push(property);
    }
    console.log(`✅ Created ${properties.length} properties`);

    console.log('📅 Creating bookings...');
    for (let i = 0; i < bookingsData.length; i++) {
      const bookingData = bookingsData[i];
      const booking = new Booking({
        ...bookingData,
        property: properties[i]._id,
        guest: users[2]._id, // Mike Wilson as guest
        host: properties[i].host
      });
      await booking.save();
    }
    console.log(`✅ Created ${bookingsData.length} bookings`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Properties: ${properties.length}`);
    console.log(`- Bookings: ${bookingsData.length}`);
    
    console.log('\n🔑 Test Accounts:');
    console.log('Host (Superhost): hassan.nahid.dev@gmail.com / StrongP@ss1');
    console.log('Host (Superhost): alex.rodriguez@gmail.com / SecurePass123');
    console.log('Host (Regular): david.kim.host@yahoo.com / HostLife456');
    console.log('Guest: jessica.chen@outlook.com / MyPass2024!');
    console.log('Guest: maria.santos.travel@gmail.com / TravelLove789');
    console.log('Guest: robert.thompson.biz@gmail.com / Business2024');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
};

runSeeder();