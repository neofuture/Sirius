export interface Menu {
  title: string;
  url: string;
  slug: string;
  image?: string;
  categories?: Menu[];
  brands?: Menu[];
  children?: Menu[];
}
