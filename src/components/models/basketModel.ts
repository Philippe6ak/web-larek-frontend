import { IBasketModel, IBasketState, IProduct, IBasketItem } from '../../types';
import { eventEmitter } from '../../utils/eventEmitter';

export class BasketModel implements IBasketModel {
    private state: IBasketState = { 
        items: [], 
        total: 0 
    };

    getState(): IBasketState {
        return { 
            items: [...this.state.items],
            total: this.state.total
        };
    }

    addItem(product: IProduct): void {
        if (product.price === null) {
            console.log('Cannot add priceless product to basket');
            return;
        }
        const existingItemIndex = this.state.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            console.log('Product already in basket');
            return;
        }

        const newItem: IBasketItem = {
            ...product,
            index: this.state.items.length + 1
        };

        this.state.items.push(newItem);
        this.state.total += product.price;
        this.emitStateChange();
    }

    // Remove product from basket
    removeItem(id: string): void {
        const itemIndex = this.state.items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            console.warn('Product not found in basket');
            return;
        }

        const removedItem = this.state.items[itemIndex];
        
        this.state.items.splice(itemIndex, 1);
        this.state.total -= removedItem.price || 0;
        this.reindexItems();
        this.emitStateChange();
    }

    clear(): void { //used when the order is completed
        this.state = { items: [], total: 0 };
        this.emitStateChange();
    }

    isInBasket(productId: string): boolean {
        return this.state.items.some(item => item.id === productId);
    }

    getItemCount(): number {
        return this.state.items.length;
    }

    private reindexItems(): void {
        this.state.items.forEach((item, index) => {
            item.index = index + 1; // 1-based indexing
        });
    }

    private emitStateChange(): void {
        eventEmitter.emit('basket:changed', this.getState());
        
        eventEmitter.emit('basket:itemCount', this.getItemCount());
        eventEmitter.emit('basket:totalUpdated', this.state.total);
    }
}