import { Component } from '../base/component';
import { eventEmitter } from '../../utils/eventEmitter';
import { TPaymentType } from '../../types/index';

export class PaymentForm extends Component {
    private paymentType: TPaymentType | null = null;
    private address: string = '';

    constructor() {
        super(document.createElement('div'));
    }

    render(): HTMLElement {
        const template = document.getElementById('order') as HTMLTemplateElement;
        const content = template.content.cloneNode(true) as DocumentFragment;
        this.container.innerHTML = '';
        this.container.appendChild(content);
        
        this.setupEventListeners();
        return this.container;
    }

    private setupEventListeners(): void {
        const form = this.container.querySelector('form')!;
        const paymentButtons = form.querySelectorAll('.button_alt');
        const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorElement = form.querySelector('.form__errors') as HTMLElement;

        // Payment type selection
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('button_active'));
                button.classList.add('button_active');
                
                this.paymentType = button.textContent === 'Онлайн' ? 'online' : 'cash';
                this.validateForm(errorElement);
            });
        });

        // Address input
        addressInput.addEventListener('input', () => {
            this.address = addressInput.value.trim();
            this.validateForm(errorElement);
        });

        // Form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.isValid()) {
                eventEmitter.emit('payment:complete', {
                    payment: this.paymentType!,
                    address: this.address
                });
            }
        });

        this.validateForm(errorElement);
    }

    private validateForm(errorElement: HTMLElement): void {
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errors: string[] = [];

        if (!this.paymentType) {
            errors.push('Необходимо указать способ оплаты');
        }

        if (!this.address) {
            errors.push('Необходимо указать адрес доставки');
        }

        // Update error message
        errorElement.textContent = errors.join(', ');
        submitButton.disabled = errors.length > 0;
    }

    private isValid(): boolean {
        return !!this.paymentType && !!this.address;
    }

    getData(): { payment: TPaymentType; address: string } {
        return {
            payment: this.paymentType!,
            address: this.address
        };
    }
}