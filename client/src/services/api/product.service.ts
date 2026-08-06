import { ProductQueryParams, ProductsResponse } from "@/types/product.types";
import { apiClient } from "./axios.config"


export class ProductService {

    private static readonly ENDPOINT = '/products';


    
    static async getProducts(params? : ProductQueryParams): Promise<ProductsResponse>{
        const response = await apiClient.get<ProductsResponse>(this.ENDPOINT, {params});
        return response.data;
    }
}