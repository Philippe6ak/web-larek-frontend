import { Component } from '../base/component';
import { eventEmitter } from '../../utils/eventEmitter';

export class Header extends Component {
    private cartCountElement: HTMLElement;
    private cartButton: HTMLButtonElement;
    private itemCount: number = 0;

    constructor(container: HTMLElement) {
        super(container);
        this.cartCountElement = this.container.querySelector('.header__basket-counter')!;
        this.cartButton = this.container.querySelector('.header__basket')!;
        
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Listen for actual item count
        eventEmitter.on('basket:itemCount', (count: number) => {
            this.itemCount = count;
            this.updateCartCount();
        });

        this.cartButton.addEventListener('click', () => {
            eventEmitter.emit('cart:open');
        });
    }

    private updateCartCount(): void {
        this.cartCountElement.textContent = this.itemCount.toString();
        this.cartCountElement.style.display = this.itemCount > 0 ? 'block' : 'none';
    }

    render(): HTMLElement {
        return this.container;
    }
}