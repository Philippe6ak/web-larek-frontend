import { Component } from '../base/component';
import { IOrderResponse } from '../../types/index';
import { eventEmitter } from '../../utils/eventEmitter';

export class OrderSuccess extends Component {
    private orderIdElement: HTMLElement;
    private totalElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.orderIdElement = this.container.querySelector('.order-success__id')!;
        this.totalElement = this.container.querySelector('.order-success__total')!;
        this.closeButton = this.container.querySelector('.order-success__close')!;
        
        this.setupEventListeners();
    }

    render(orderData: IOrderResponse): HTMLElement {
        this.orderIdElement.textContent = orderData.id;
        this.totalElement.textContent = `${orderData.total} синапсов`;
        return this.container;
    }

    private setupEventListeners(): void {
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Close on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    private close(): void {
        eventEmitter.emit('modal:closed');
        eventEmitter.emit('order:complete');
    }
}