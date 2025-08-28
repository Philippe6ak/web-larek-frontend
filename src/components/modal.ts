import { Component } from './baseComponent';
import { eventEmitter } from '../utils/eventEmitter';

export class Modal extends Component {
    private contentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.contentContainer = this.container.querySelector('.modal__content')!;
        this.closeButton = this.container.querySelector('.modal__close')!;
        
        this.setupEventListeners();
    }

    open(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        this.setVisible(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    close(): void {
        this.setVisible(false);
        document.body.style.overflow = ''; // Re-enable scrolling
        eventEmitter.emit('modal:closed');
    }

    private setupEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.close());
        
        // Close modal when clicking outside
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        // Close modal on Escape key
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