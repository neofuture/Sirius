class Images {
  url: string = '';
}

class FeaturedItem {
  listing_id?: number;
  title: string  = '';
  images: Images[] = [];
  url: string = '';
  name?: string = '';
}

class Shop {
  shop_url: string = '';
  shop_name: string = '';
}

export interface ListingsInterface {
  featuredItems: FeaturedItem[];
  featuredCategoryOneListingsName: string;
  featuredCategoryOneListings: FeaturedItem[];
  featuredCategoryTwoListingsName: string;
  featuredCategoryTwoListings: FeaturedItem[];
  featuredCategoryThreeListingsName: string;
  featuredCategoryThreeListings: FeaturedItem[];
  latestListings: FeaturedItem[];
  featuredSeller: Object;
  featuredSellerListings: FeaturedItem[];
  Shops: Shop[];
  greatest_deals: FeaturedItem[];
  Automotive: FeaturedItem[];
  featuredCategories: FeaturedItem[];
  topBrands: FeaturedItem[];
}
