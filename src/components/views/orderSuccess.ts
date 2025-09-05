import { Component } from '../base/component';
import { IOrderResponse } from '../../types/index';
import { eventEmitter } from '../../utils/eventEmitter';

export class OrderSuccess extends Component {
    private descriptionElement: HTMLElement | null;
    private closeButton: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.descriptionElement = this.container.querySelector('.order-success__description');
        this.closeButton = this.container.querySelector('.order-success__close');

        this.setupEventListeners();
    }

    render(orderData: IOrderResponse): HTMLElement {
        console.log('something should appear!');
        if (this.descriptionElement) {
            this.descriptionElement.textContent = 
                `Списано ${orderData.total} синапсов`;
        }
        eventEmitter.emit('order:complete');

        return this.container;
    }

    private setupEventListeners(): void {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                eventEmitter.emit('orderSuccess:close');
            });
        }
    }
}