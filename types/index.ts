export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  imageUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
};

export type PriceVerification = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  date: string;
};

export type PriceSubmission = {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  storeId: string;
  storeName: string;
  price: number;
  currency: string;
  date: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mediaUrls: string[];
  mediaTypes: ('image' | 'video' | 'receipt')[];
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down' | null;
  verifications: PriceVerification[];
  userVerified?: boolean;
};

export type User = {
  id: string;
  name: string;
  avatar?: string;
  submissionCount: number;
  upvotesReceived: number;
};

export type FilterOptions = {
  category?: string;
  store?: string;
  priceRange?: [number, number];
  sortBy: 'newest' | 'oldest' | 'priceHighToLow' | 'priceLowToHigh';
};