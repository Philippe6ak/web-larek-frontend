import { Component } from './baseComponent';
import { IProduct } from '../types';
import { Card } from './card';
import { eventEmitter } from '../utils/eventEmitter';

export class ProductList extends Component {
    private cardComponent: Card;

    constructor(container: HTMLElement) {
        super(container);
        this.cardComponent = new Card('card-catalog-template');
    }

    render(products: IProduct[]): HTMLElement {
        this.container.innerHTML = '';
        
        if (products.length === 0) {
            this.container.innerHTML = '<p class="empty-message">Товары не найдены</p>';
            return this.container;
        }

        products.forEach(product => {
            const productElement = this.cardComponent.renderGallery(product);
            this.container.appendChild(productElement);
        });

        return this.container;
    }

    setLoading(isLoading: boolean): void {
        if (isLoading) {
            this.container.innerHTML = '<p class="loading-message">Загрузка товаров...</p>';
        }
    }

    showError(message: string): void {
        this.container.innerHTML = `<p class="error-message">${message}</p>`;
    }
}