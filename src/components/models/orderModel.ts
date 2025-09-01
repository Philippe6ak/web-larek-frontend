import { IOrderData, IOrderResponse, IApiError } from '../../types/index';
import { Api } from '../base/api';
import { API_URL } from '../../utils/constants';
import { BasketModel } from '../models/basketModel';

export class OrderModel {
    private api: Api;
    private basketModel: BasketModel;

    constructor(basketModel: BasketModel) {
        this.api = new Api(API_URL);
        this.basketModel = basketModel;
    }

    // Validate order form data
    validateOrderData(formData: IOrderData): string[] {
        const errors: string[] = [];
        
        if (!formData.email || !formData.email.includes('@')) {
            errors.push('Invalid email address');
        }
        
        if (!formData.phone || formData.phone.length < 5) {
            errors.push('Phone number too short');
        }
        
        if (!formData.address || formData.address.trim().length === 0) {
            errors.push('Address is required');
        }
        
        if (!formData.payment) {
            errors.push('Payment method is required');
        }

        return errors;
    }

    // Submit order to server
    async submitOrder(formData: IOrderData): Promise<IOrderResponse> {
        try {
            // Get current basket state
            const basketState = this.basketModel.getState();
            
            // Prepare order data for API
            const orderData: IOrderData = {
                ...formData,
                total: basketState.total,
                items: basketState.items.map(item => item.id)
            };

            // Send to server
            const response = await this.api.post('/orders', orderData) as IOrderResponse;
            
            return response;
            
        } catch (error) {
            const apiError = error as IApiError;
            throw new Error(apiError.error || 'Order submission failed');
        }
    }

    // Optional: Get order status
    async getOrderStatus(orderId: string): Promise<any> {
        return this.api.get(`/orders/${orderId}`);
    }
}