import { Component } from '../base/component';
import { eventEmitter } from '../../utils/eventEmitter';

export class ContactForm extends Component {
    private email: string = '';
    private phone: string = '';

    constructor() {
        super(document.createElement('div'));
    }

    render(): HTMLElement {
        const template = document.getElementById('contacts') as HTMLTemplateElement;
        const content = template.content.cloneNode(true) as DocumentFragment;
        this.container.innerHTML = '';
        this.container.appendChild(content);
        
        this.setupEventListeners();
        return this.container;
    }

    private setupEventListeners(): void {
        const form = this.container.querySelector('form')!;
        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorElement = form.querySelector('.form__errors') as HTMLElement;

        // Email input
        emailInput.addEventListener('input', () => {
            this.email = emailInput.value.trim();
            this.validateForm(errorElement);
        });

        // Phone input
        phoneInput.addEventListener('input', () => {
            this.phone = phoneInput.value.trim();
            this.validateForm(errorElement);
        });

        // Form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.isValid()) {
                eventEmitter.emit('contact:complete', {
                    email: this.email,
                    phone: this.phone
                });
            }
        });

        this.validateForm(errorElement);
    }

    private validateForm(errorElement: HTMLElement): void {
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errors: string[] = [];

        if (!this.email) {
            errors.push('Необходимо указать email');
        }

        if (!this.phone) {
            errors.push('Необходимо указать телефон');
        }

        // Update error message
        errorElement.textContent = errors.join(', ');
        submitButton.disabled = errors.length > 0;
    }

    private isValid(): boolean {
        return !!this.email && !!this.phone;
    }

    getData(): { email: string; phone: string } {
        return {
            email: this.email,
            phone: this.phone
        };
    }
}