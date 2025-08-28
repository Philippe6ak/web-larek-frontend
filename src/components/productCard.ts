import { Component } from './base/component';
import { IProduct, IBasketItem } from '../types';
import { eventEmitter } from '../utils/eventEmitter';

export class Card extends Component {
    private template: HTMLTemplateElement;

    constructor(templateId: string) {
        super(document.createElement('div'));
        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        
        if (!this.template) {
            throw new Error(`Template with id "${templateId}" not found`);
        }
    }

    // For main gallery products
    renderGallery(data: IProduct): HTMLElement {
        const card = this.createCardFromTemplate();
        
        this.populateCard(card, data);
        
        // Whole card is clickable for preview
        card.addEventListener('click', () => {
            eventEmitter.emit('product:preview', data.id);
        });

        return card;
    }

    // For modal preview with add/remove functionality
    renderPreview(data: IProduct, isInBasket: boolean = false): HTMLElement {
        const card = this.createCardFromTemplate();
        
        this.populateCard(card, data);
        
        // Handle button based on product state
        const button = card.querySelector('.card__button') as HTMLButtonElement;
        if (button) {
            this.setupPreviewButton(button, data, isInBasket);
        }

        return card;
    }

    // For basket items with delete functionality
    renderBasket(item: IBasketItem): HTMLElement {
        const card = this.createCardFromTemplate();
        
        // Basket-specific population
        const indexElement = card.querySelector('.basket__item-index') as HTMLElement | null;
        const titleElement = card.querySelector('.card__title') as HTMLElement | null;
        const priceElement = card.querySelector('.card__price') as HTMLElement | null;
        const deleteButton = card.querySelector('.basket__item-delete') as HTMLButtonElement | null;

        if (indexElement) this.setText(indexElement, item.index.toString());
        if (titleElement) this.setText(titleElement, item.title);
        if (priceElement) this.setPrice(priceElement, item.price);

        // Setup delete functionality
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                eventEmitter.emit('basket:remove', item.id);
            });
        }

        return card;
    }

    // Private helper methods
    private createCardFromTemplate(): HTMLElement {
        const fragment = this.template.content.cloneNode(true) as DocumentFragment;
        return fragment.firstElementChild as HTMLElement;
    }

    private populateCard(card: HTMLElement, data: IProduct): void {
    // Use type assertions for DOM elements
        const categoryElement = card.querySelector('.card__category') as HTMLElement | null;
        const titleElement = card.querySelector('.card__title') as HTMLElement | null;
        const imageElement = card.querySelector('.card__image') as HTMLImageElement | null;
        const priceElement = card.querySelector('.card__price') as HTMLElement | null;
        const descriptionElement = card.querySelector('.card__text') as HTMLElement | null;

        if (categoryElement) {
            this.setText(categoryElement, data.category);
            categoryElement.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        }
        if (titleElement) this.setText(titleElement, data.title);
        if (imageElement) this.setImage(imageElement, data.image, data.title);
        if (priceElement) this.setPrice(priceElement, data.price);
        if (descriptionElement) this.setText(descriptionElement, data.description);
    }

    private setupPreviewButton(button: HTMLButtonElement, data: IProduct, isInBasket: boolean): void {
        if (data.price === null) {
            button.disabled = true;
            button.textContent = 'Бесценный товар';
        } else if (isInBasket) {
            button.textContent = 'Убрать';
            button.addEventListener('click', () => {
                eventEmitter.emit('basket:remove', data.id);
            });
        } else {
            button.textContent = 'В корзину';
            button.addEventListener('click', () => {
                eventEmitter.emit('basket:add', data.id);
            });
        }
    }

    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'другое': 'other',
            'дополнительное': 'additional',
            'кнопка': 'button'
        };
        return categoryMap[category] || 'other';
    }

    // Required by base component
    render(): HTMLElement {
        return this.container;
    }
}