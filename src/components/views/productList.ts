import { Component } from '../base/component';
import { IProduct } from '../../types/index';
import { Card } from './card';

export class ProductList extends Component {
    
    constructor(container: HTMLElement) {
        super(container);
    }

    render(products: IProduct[]): HTMLElement {
        this.container.innerHTML = '';
        
        products.forEach(product => {
            const cardComponent = new Card('card-catalog');
            const productElement = cardComponent.renderGallery(product);
            this.container.appendChild(productElement);
        });

        return this.container;
    }
}