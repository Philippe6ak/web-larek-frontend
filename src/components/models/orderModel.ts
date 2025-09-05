import { IOrderData, IOrderResponse, IApiError, IBasketState, TFormErrors } from '../../types/index';
import { Api } from '../base/api';
import { API_URL } from '../../utils/constants';
import { BasketModel } from '../models/basketModel';
import { eventEmitter } from '../../utils/eventEmitter';

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
            errors.push('Введите Email');
        }
        
        if (!formData.phone) {
            errors.push('Нужно ввести ваш номер');
        }
        
        if (!formData.address || formData.address.trim().length === 0) {
            errors.push('Нужен адресс');
        }
        
        if (!formData.payment) {
            errors.push('Нужно указать способ оплаты');
        }

        return errors;
    }

    // Submit order to server
    async submitOrder(formData: IOrderData): Promise<IOrderResponse | null> {
        const errors = this.validateOrderData(formData);
        if (Object.keys(errors).length > 0) {
            eventEmitter.emit('order:validationError', errors);
            return null;
        }

        try {
            const basketState = this.basketModel.getState();
            
            const orderData = {
                payment: formData.payment,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                total: basketState.total,
                items: basketState.items.map(item => item.id)
            };

            const response = await this.api.post('/order/', orderData) as IOrderResponse;

            this.basketModel.clear();
            
            eventEmitter.emit('order:success', response);
            eventEmitter.emit('checkout:complete', response);
            
            return response;
            
        } catch (error) {
            const apiError = error as IApiError;
            
            // Emit error events
            eventEmitter.emit('order:error', apiError);
            eventEmitter.emit('checkout:error', 'Order submission failed');
        }
    }
}