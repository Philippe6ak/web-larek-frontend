import { Component } from '../base/component';
import { IBasketState } from '../../types/index';
import { eventEmitter } from '../../utils/eventEmitter';
import { Card } from './card';

export class Basket extends Component {
    private cardComponent: Card;
    private basketList: HTMLElement;
    private basketTotal: HTMLElement;
    private checkoutButton: HTMLButtonElement;
    private emptyMessage!: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.cardComponent = new Card('card-basket');
        
        this.basketList = this.container.querySelector('.basket__list')!;
        this.basketTotal = this.container.querySelector('.basket__price')!;
        this.checkoutButton = this.container.querySelector('.basket__button')!;
        
        this.createEmptyMessage();
        this.setupEventListeners();
    }

    render(state: IBasketState): HTMLElement {
        this.updateBasketContent(state);
        return this.container;
    }

    private createEmptyMessage(): void {
        this.emptyMessage = document.createElement('div');
        this.emptyMessage.className = 'basket__empty-message';
        this.emptyMessage.textContent = 'Корзина пуста';
        this.emptyMessage.style.display = 'none';
        this.container.insertBefore(this.emptyMessage, this.basketList);
    }

    private setupEventListeners(): void {
        this.checkoutButton.addEventListener('click', () => {
            eventEmitter.emit('checkout:start');
        });

        eventEmitter.on('basket:changed', (state?: IBasketState) => {
        if (state) {
            this.render(state);
        }
    });
    }

    private updateBasketContent(state: IBasketState): void {
        this.basketList.innerHTML = '';
        
        this.emptyMessage.style.display = state.items.length === 0 ? 'block' : 'none';
        
        this.basketTotal.textContent = `${state.total} синапсов`;
        
        this.checkoutButton.disabled = state.items.length === 0;
        
        if (state.items.length > 0) {
            state.items.forEach(item => {
                const basketItemElement = this.cardComponent.renderBasket(item);
                this.basketList.appendChild(basketItemElement);
            });
        }
    }

    showError(message: string): void {
        const errorElement = document.createElement('div');
        errorElement.className = 'basket__error';
        errorElement.textContent = message;
        
        const existingError = this.container.querySelector('.basket__error');
        if (existingError) {
            existingError.remove();
        }

        this.container.appendChild(errorElement);
    }

    clearError(): void {
        const errorElement = this.container.querySelector('.basket__error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}