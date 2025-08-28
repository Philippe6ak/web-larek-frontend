import { IBasketModel, IBasketState, IProduct, IBasketItem } from '../types';
import { eventEmitter } from '../utils/eventEmitter';

export class BasketModel implements IBasketModel {
    // Private state - only this class can modify it
    private state: IBasketState = { 
        items: [], 
        total: 0 
    };

    // Public method to get current state (returns a copy for safety)
    getState(): IBasketState {
        return { 
            items: [...this.state.items], // Copy array to prevent external modification
            total: this.state.total 
        };
    }

    // Add product to basket with validation
    addItem(product: IProduct): void {
        // Validate product can be added
        if (product.price === null) {
            console.log('Cannot add priceless product to basket');
            return;
        }

        // Check if product already exists in basket
        const existingItemIndex = this.state.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            // Product already in basket - we could increment quantity here
            // For now, we'll just ignore duplicates since we're doing 1 item per product
            console.log('Product already in basket');
            return;
        }

        // Create basket item with index
        const newItem: IBasketItem = {
            ...product,
            index: this.state.items.length + 1 // 1-based indexing
        };

        // Update state
        this.state.items.push(newItem);
        this.state.total += product.price;

        // Notify everyone that basket changed
        this.emitStateChange();
    }

    // Remove product from basket
    removeItem(id: string): void {
        const itemIndex = this.state.items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            console.warn('Product not found in basket');
            return;
        }

        // Get item being removed
        const removedItem = this.state.items[itemIndex];
        
        // Update state
        this.state.items.splice(itemIndex, 1);
        this.state.total -= removedItem.price || 0;

        // Re-index remaining items
        this.reindexItems();

        // Notify everyone that basket changed
        this.emitStateChange();
    }

    // Clear entire basket
    clear(): void {
        this.state = { items: [], total: 0 };
        this.emitStateChange();
    }

    // Check if product is in basket
    isInBasket(productId: string): boolean {
        return this.state.items.some(item => item.id === productId);
    }

    // Get item count
    getItemCount(): number {
        return this.state.items.length;
    }

    // Private helper methods
    private reindexItems(): void {
        this.state.items.forEach((item, index) => {
            item.index = index + 1; // 1-based indexing
        });
    }

    private emitStateChange(): void {
        // Emit event with current state
        eventEmitter.emit('basket:changed', this.getState());
        
        // Also emit specific events for analytics/debugging
        eventEmitter.emit('basket:itemCount', this.getItemCount());
        eventEmitter.emit('basket:totalUpdated', this.state.total);
    }

    // Optional: Validation methods
    validateBasket(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Check for priceless items (shouldn't happen with our validation)
        const pricelessItems = this.state.items.filter(item => item.price === null);
        if (pricelessItems.length > 0) {
            errors.push('Basket contains priceless items');
        }

        // Check total calculation (sanity check)
        const calculatedTotal = this.state.items.reduce((sum, item) => sum + (item.price || 0), 0);
        if (Math.abs(this.state.total - calculatedTotal) > 0.01) {
            errors.push('Total calculation mismatch');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}