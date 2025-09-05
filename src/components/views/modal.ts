import { Component } from '../base/component';
import { eventEmitter } from '../../utils/eventEmitter';

export class Modal extends Component {
    private contentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;
    private scrollPosition: number = 0;

    constructor(container: HTMLElement) {
        super(container);
        this.contentContainer = this.container.querySelector('.modal__content')!;
        this.closeButton = this.container.querySelector('.modal__close')!;
        
        this.setupEventListeners();
    }

    render(): HTMLElement {
        return this.container;
    }

    open(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        this.scrollPosition = window.scrollY;

        this.container.style.top = `${this.scrollPosition}px`;
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        document.body.style.overflow = '';
        this.container.classList.remove('modal_active');
        eventEmitter.emit('modal:closed');
        window.scrollTo(0, this.scrollPosition);
    }

    private setupEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.close());
        
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    setVisible(isVisible: boolean): void {
        this.container.style.display = isVisible ? 'block' : 'none';
    }
}