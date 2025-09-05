import { Component } from '../base/component';
import { IProduct, IBasketItem } from '../../types/index';
import { eventEmitter } from '../../utils/eventEmitter';
import { CDN_URL } from '../../utils/constants';

export class Card extends Component {
    private template: HTMLTemplateElement;

    constructor(templateId: string) {
        super(document.createElement('div'));
        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        
        if (!this.template) {
            throw new Error(`Template with id "${templateId}" not found`);
        }
    }

    // main gallery
    renderGallery(data: IProduct): HTMLElement {
        const card = this.createCardFromTemplate();
        this.populateCardBasic(card, data);
        
        card.addEventListener('click', () => {
            eventEmitter.emit('product:preview', data.id);
        });

        return card;
    }

    // for modal
    renderPreview(data: IProduct, isInBasket: boolean = false): HTMLElement {
        const card = this.createCardFromTemplate();
        this.populateCardDetailed(card, data);

        const button = card.querySelector('.card__button') as HTMLButtonElement | null;
        if (button) {
            this.setupPreviewButton(button, data, isInBasket);
        }

        return card;
    }

    // for cart
    renderBasket(item: IBasketItem): HTMLElement {
        const card = this.createCardFromTemplate();
        
        const indexElement = card.querySelector('.basket__item-index') as HTMLElement | null;
        const titleElement = card.querySelector('.card__title') as HTMLElement | null;
        const priceElement = card.querySelector('.card__price') as HTMLElement | null;
        const deleteButton = card.querySelector('.basket__item-delete') as HTMLButtonElement | null;

        if (indexElement) this.setText(indexElement, item.index.toString());
        if (titleElement) this.setText(titleElement, item.title);
        if (priceElement) this.setPrice(priceElement, item.price);

        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                eventEmitter.emit('basket:remove', item.id);
            });
        }

        return card;
    }

    private createCardFromTemplate(): HTMLElement {
        const fragment = this.template.content.cloneNode(true) as DocumentFragment;
        return fragment.firstElementChild as HTMLElement;
    }

    private populateCardBasic(card: HTMLElement, data: IProduct): void {
        const categoryElement = card.querySelector('.card__category') as HTMLElement | null;
        const titleElement = card.querySelector('.card__title') as HTMLElement | null;
        const imageElement = card.querySelector('.card__image') as HTMLImageElement | null;
        const priceElement = card.querySelector('.card__price') as HTMLElement | null;

        if (categoryElement) {
            this.setText(categoryElement, data.category);
            categoryElement.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        }
        if (titleElement) this.setText(titleElement, data.title);
        if (imageElement) this.setImage(imageElement, data.image, data.title);
        if (priceElement) this.setPrice(priceElement, data.price);
    }

    private populateCardDetailed(card: HTMLElement, data: IProduct): void {
        this.populateCardBasic(card, data);
        
        const descriptionElement = card.querySelector('.card__text') as HTMLElement | null;
        if (descriptionElement) this.setText(descriptionElement, data.description);
    }

    private setupPreviewButton(button: HTMLButtonElement, data: IProduct, isInBasket: boolean): void {
        if (data.price === null) {
            // Priceless item - disable button
            button.disabled = true;
            button.textContent = 'Бесценный товар';
        } else if (isInBasket) {
            // Item in basket - show remove option
            button.textContent = 'Удалить из корзины';
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                eventEmitter.emit('basket:remove', data.id);
            });
        } else {
            // Item not in basket - show add option
            button.textContent = 'Купить';
            button.addEventListener('click', (event) => {
                event.stopPropagation();
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

    protected setPrice(element: HTMLElement, price: number | null): void {
        this.setText(element, price === null ? 'Бесценный товар' : `${price} синапсов`);
    }

    protected setImage(element: HTMLImageElement, src: string, alt: string = ''): void {
        element.src = src.startsWith('http') ? src : `${CDN_URL}${src}`;
        element.alt = alt;
    }

    render(): HTMLElement {
        return this.container;
    }
}