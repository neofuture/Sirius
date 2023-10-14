export interface MenuInterface {
  title: string;
  url: string;
  slug: string;
  image?: string;
  categories?: MenuInterface[];
  brands?: MenuInterface[];
  children?: MenuInterface[];
}
