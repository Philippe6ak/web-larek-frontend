import { Component } from '../base/component';
import { IProduct } from '../../types/index';
import { Card } from './card';

export class ProductList extends Component {
    private cardComponent: Card;

    constructor(container: HTMLElement) {
        super(container);
        this.cardComponent = new Card('card-catalog-template');
    }

    render(products: IProduct[]): HTMLElement {
        this.container.innerHTML = '';
        
        products.forEach(product => {
            const productElement = this.cardComponent.renderGallery(product);
            this.container.appendChild(productElement);
        });

        return this.container;
    }
}