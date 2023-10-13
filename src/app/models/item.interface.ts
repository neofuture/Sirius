export interface Item {
  data?: {
    title: string;
    shop?: {
      name?: string;
      url?: string;
    };
    images: Array<{ url: string }>;
    description?: string;
  };
}
