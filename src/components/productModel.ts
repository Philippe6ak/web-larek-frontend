// models/ProductModel.ts
import { Api } from './base/api';
import { IProduct, IApiListResponse } from '../types/index';
import { API_URL } from '../utils/constants';

export class ProductModel {
    private products: IProduct[] = [];

    constructor(private api: Api = new Api(API_URL)) {}

    async loadProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get('/products') as IApiListResponse<IProduct>;
            this.products = response.items;
            return this.products;
        } catch (error) {
            console.error('Failed to load products:', error);
            throw new Error('Не удалось загрузить товары');
        }
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductsByCategory(category: string): IProduct[] {
        return this.products.filter(product => product.category === category);
    }
}