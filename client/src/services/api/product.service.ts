import { Product, ProductQueryParams, ProductsResponse } from "@/types/product.types";
import { apiClient } from "./axios.config"


export class ProductService {

    private static readonly ENDPOINT = '/products';


    
    static async getProducts(params? : ProductQueryParams): Promise<ProductsResponse>{
        const response = await apiClient.get<ProductsResponse>(this.ENDPOINT, {params});
        return response.data;
    }


    static async getProductById(productId: string): Promise<Product> {
        const response = await apiClient.get<Product>(`${this.ENDPOINT}/${productId}`);
        return response.data;
    }
}