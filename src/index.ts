import './scss/styles.scss';
import { ProductModel } from './components/productModel';
import { BasketModel } from './components/basketModel';
import { ProductList } from './components/productList';
import { Basket } from './components/basket';
import { Modal } from './components/modal';
import { Card } from './components/card';
import { eventEmitter } from './utils/eventEmitter';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

class App {
    private productModel: ProductModel;
    private basketModel: BasketModel;
    private productList: ProductList;
    private basket: Basket;
    private modal: Modal;
    private previewCard: Card;

    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.loadData();
    }

    private initializeComponents(): void {
        const api = new Api(API_URL);
        
        this.productModel = new ProductModel(api);
        this.basketModel = new BasketModel();
        
        this.productList = new ProductList(document.querySelector('.gallery')!);
        this.basket = new Basket(document.querySelector('.basket')!);
        this.modal = new Modal(document.getElementById('modal-container')!);
        this.previewCard = new Card('card-preview-template');

        // Initial render
        this.productList.render([]);
        this.basket.render(this.basketModel.getState());
    }

    private async loadData(): Promise<void> {
        try {
            this.productList.setLoading(true);
            const products = await this.productModel.loadProducts();
            this.productList.render(products);
        } catch (error) {
            this.productList.showError(error.message);
        }
    }

    private setupEventListeners(): void {
        // Product preview
        eventEmitter.on('product:preview', (productId: string) => {
            const product = this.productModel.getProductById(productId);
            if (product) {
                const isInBasket = this.basketModel.isInBasket(productId);
                const preview = this.previewCard.renderPreview(product, isInBasket);
                this.modal.open(preview);
            }
        });

        // Basket operations
        eventEmitter.on('basket:add', (productId: string) => {
            const product = this.productModel.getProductById(productId);
            if (product) {
                this.basketModel.addItem(product);
            }
        });

        eventEmitter.on('basket:remove', (productId: string) => {
            this.basketModel.removeItem(productId);
        });

        // Checkout flow
        eventEmitter.on('checkout:start', () => {
            this.startCheckout();
        });

        // Modal closed
        eventEmitter.on('modal:closed', () => {
            // Refresh any necessary state
        });

        // Error handling
        eventEmitter.on('error', (message: string) => {
            console.error('Application error:', message);
        });
    }

    private startCheckout(): void {
        const basketState = this.basketModel.getState();
        if (basketState.items.length === 0) {
            eventEmitter.emit('error', 'Корзина пуста');
            return;
        }

        // Here you would open the checkout form
        console.log('Starting checkout with:', basketState);
        eventEmitter.emit('checkout:form:open');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});