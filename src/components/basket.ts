import { Component } from './baseComponent';
import { IBasketState } from '../types';
import { eventEmitter } from '../utils/eventEmitter';
import { Card } from './card';

export class Basket extends Component {
    private cardComponent: Card;
    private basketList: HTMLElement;
    private basketTotal: HTMLElement;
    private checkoutButton: HTMLButtonElement;
    private emptyMessage: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        // Initialize card component for basket items
        this.cardComponent = new Card('card-basket-template');
        
        // Cache DOM elements that already exist in HTML
        this.basketList = this.container.querySelector('.basket__list')!;
        this.basketTotal = this.container.querySelector('.basket__price')!;
        this.checkoutButton = this.container.querySelector('.button')!;
        
        // Create empty message element if it doesn't exist
        this.createEmptyMessage();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    // Render basket with current state
    render(state: IBasketState): HTMLElement {
        this.updateBasketContent(state);
        return this.container;
    }

    // Create empty message element
    private createEmptyMessage(): void {
        this.emptyMessage = document.createElement('div');
        this.emptyMessage.className = 'basket__empty-message';
        this.emptyMessage.textContent = 'Корзина пуста';
        this.emptyMessage.style.display = 'none';
        this.container.insertBefore(this.emptyMessage, this.basketList);
    }

    // Set up event listeners
    private setupEventListeners(): void {
        // Handle checkout button click
        this.checkoutButton.addEventListener('click', () => {
            eventEmitter.emit('checkout:start');
        });

        // Listen for basket changes
        eventEmitter.on('basket:changed', (state: IBasketState) => {
            this.render(state);
        });
    }

    // Update basket content based on state
    private updateBasketContent(state: IBasketState): void {
        // Clear previous items
        this.basketList.innerHTML = '';
        
        // Show/hide empty message
        this.emptyMessage.style.display = state.items.length === 0 ? 'block' : 'none';
        
        // Update total
        this.basketTotal.textContent = `${state.total} синапсов`;
        
        // Enable/disable checkout button
        this.checkoutButton.disabled = state.items.length === 0;
        
        // Add items to basket
        if (state.items.length > 0) {
            state.items.forEach(item => {
                const basketItemElement = this.cardComponent.renderBasket(item);
                this.basketList.appendChild(basketItemElement);
            });
        }
    }

    // Show loading state
    setLoading(isLoading: boolean): void {
        this.checkoutButton.disabled = isLoading;
        this.checkoutButton.textContent = isLoading ? 'Загрузка...' : 'Оформить';
    }

    // Show error state
    showError(message: string): void {
        const errorElement = document.createElement('div');
        errorElement.className = 'basket__error';
        errorElement.textContent = message;
        
        // Remove existing error if any
        const existingError = this.container.querySelector('.basket__error');
        if (existingError) {
            existingError.remove();
        }
        
        this.container.appendChild(errorElement);
    }

    // Clear error state
    clearError(): void {
        const errorElement = this.container.querySelector('.basket__error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}