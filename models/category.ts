import { IBase } from "./base";
import { IProduct } from "./product";

export type ICategory = IBase & {
  name: string;
  description: string;
  categoryRef: string;
  image: string;
  sortOrder: number;
  parentCategory: any;
  children?: ICategory[];
  headerText: string;
  category?: string;
  type?: string;
  tags?: string[];
  product?: IProduct;
  meta?: {
    title: string;
    keywords: string;
    description: string;
  };
};
