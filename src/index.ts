import './scss/styles.scss';

import { Api } from './components/base/api';
import { ProductModel } from './components/models/productModel';
import { BasketModel } from './components/models/basketModel';
import { OrderModel } from './components/models/orderModel';
import { ProductList } from './components/views/productList';
import { Basket } from './components/views/basket';
import { Header } from './components/views/header';
import { Modal } from './components/views/modal';
import { Card } from './components/views/card';
import { PaymentForm } from './components/views/paymentForm';
import { ContactForm } from './components/views/contactForm';
import { OrderSuccess } from './components/views/orderSuccess';
import { eventEmitter } from './utils/eventEmitter';
import { cloneTemplate } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrderData, IOrderResponse } from './types';

class App {
    private productModel!: ProductModel;
    private basketModel!: BasketModel;
    private orderModel!: OrderModel;
    private productList!: ProductList;
    private basket!: Basket;
    private header!: Header;
    private modal!: Modal;
    private paymentData: Partial<IOrderData> = {};

    private basketTemplate!: HTMLTemplateElement;
    private successTemplate!: HTMLTemplateElement;

    constructor() {
        this.initializeTemplates();
        this.initializeComponents();
        this.setupEventListeners();
        this.loadData();
    }

    private initializeTemplates(): void {
        this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
    }

    private initializeComponents(): void {
        const api = new Api(API_URL);
        
        // Initialize models
        this.productModel = new ProductModel(api);
        this.basketModel = new BasketModel();
        this.orderModel = new OrderModel(this.basketModel);
        
        // Initialize components
        this.productList = new ProductList(document.querySelector('.gallery')!);
        this.header = new Header(document.querySelector('.header')!);
        this.modal = new Modal(document.getElementById('modal-container')!);

        const basketElement = cloneTemplate<HTMLDivElement>(this.basketTemplate);
        this.basket = new Basket(basketElement);

        // Initial renders
        if (this.productList) {
            this.productList.render([]);
        }
        if (this.basket) {
            this.basket.render(this.basketModel.getState());
        }
    }

    private async loadData(): Promise<void> {
        try {
            const products = await this.productModel.loadProducts();
            this.productList.render(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    private setupEventListeners(): void {
        eventEmitter.on('product:preview', (productId?: string) => {
            if (productId) {
                this.showProductPreview(productId);
            }
        });

        eventEmitter.on('basket:add', (productId?: string) => {
            if (productId) {
                this.addToBasket(productId);
            }
        });

        eventEmitter.on('basket:remove', (productId?: string) => {
            if (productId) {
                this.removeFromBasket(productId);
            }
        });

        eventEmitter.on('cart:open', () => {
            this.showBasket();
        });

        eventEmitter.on('checkout:start', () => {
            this.startCheckout();
        });

        eventEmitter.on('payment:complete', (paymentData?: any) => {
            if (paymentData) {
                this.paymentData = paymentData;
                this.showContactForm();
            }
        });

        eventEmitter.on('contact:complete', async (contactData?: any) => {
            if (contactData) {
                await this.processOrder(contactData);
            }
        });

        eventEmitter.on('order:success', (orderData?: IOrderResponse) => {
            if (orderData) {
                this.showOrderSuccess(orderData);
            }
        });

        eventEmitter.on('order:error', (error?: Error) => {
            if (error) {
                this.showError(error.message);
            }
        });

        eventEmitter.on('modal:closed', () => {
            this.paymentData = {};
        });

        eventEmitter.on('orderSuccess:close', () => {
            this.modal.close();
        });
    }

    private showProductPreview(productId: string): void {
        const product = this.productModel.getProductById(productId);
        if (product) {
            const cardComponent = new Card('card-preview');
            const isInBasket = this.basketModel.isInBasket(productId);
            const preview = cardComponent.renderPreview(product, isInBasket);
            this.modal.open(preview);
        }
    }

    private addToBasket(productId: string): void {
        const product = this.productModel.getProductById(productId);
        if (product) {
            this.basketModel.addItem(product);           
            this.modal.close();
        }
    }

    private removeFromBasket(productId: string): void {
        this.basketModel.removeItem(productId);
    }

    private showBasket(): void {
        this.modal.open(this.basket.render(this.basketModel.getState()));
    }

    private startCheckout(): void {
        if (this.basketModel.getItemCount() === 0) {
            this.showError('Корзина пуста');
            return;
        }

        const paymentForm = new PaymentForm();
        this.modal.open(paymentForm.render());
    }

    private showContactForm(): void {
        const contactForm = new ContactForm();
        this.modal.open(contactForm.render());
    }

    private async processOrder(contactData: any): Promise<void> {
        try {
            const orderData: IOrderData = {
                ...this.paymentData,
                ...contactData,
                total: this.basketModel.getState().total,
                items: this.basketModel.getState().items.map(item => item.id)
            } as IOrderData;

            // Validate order data
            const errors = this.orderModel.validateOrderData(orderData);
            if (errors.length > 0) {
                this.showError(errors.join(', '));
                return;
            }

            // Submit order
            const result = await this.orderModel.submitOrder(orderData);
            
            // On success: clear basket and show success
            this.basketModel.clear();
            eventEmitter.emit('order:success', result);
            
        } catch (error) {
            eventEmitter.emit('order:error', error as Error);
        }
    }

    private showOrderSuccess(orderData: IOrderResponse): void {
        const successElement = cloneTemplate<HTMLDivElement>(this.successTemplate);
        // Create OrderSuccess component with the cloned template
        const successModal = new OrderSuccess(successElement);
        // Render with order data and open modal
        const renderedContent = successModal.render(orderData);
        this.modal.open(successModal.render(orderData));
    }

    private showError(message: string): void {
        console.error('Application error:', message);
        alert(`Ошибка: ${message}`);
    }
}

// Initialization of the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});