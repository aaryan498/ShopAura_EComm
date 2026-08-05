import { Category } from "./category.types";


export interface Product {
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    sku: string,
    imageUrl: string,
    category: Category,

}