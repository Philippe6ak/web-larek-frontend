import { IComponent } from '../types/index';
import { CDN_URL } from '../utils/constants';

export abstract class Component implements IComponent {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // This will be implemented by each specific component
    abstract render(...args: unknown[]): HTMLElement;

    // Common methods for all components
    setVisible(isVisible: boolean): void {
        this.container.style.display = isVisible ? 'block' : 'none';
    }

    setDisabled(isDisabled: boolean): void {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(button => {
            (button as HTMLButtonElement).disabled = isDisabled;
        });
    }

    // Helper methods for all components to use
    protected setText(element: HTMLElement, value: string): void {
        if (element) element.textContent = value;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        const fullSrc = src.startsWith('http') ? src : `${CDN_URL}${src}`;
        element.src = fullSrc;
        if (alt) element.alt = alt;
    }

    protected setPrice(element: HTMLElement, price: number | null): void {
        this.setText(element, price === null ? 'Бесценный товар' : `${price} синапсов`);
    }
}