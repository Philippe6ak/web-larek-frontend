//products
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null
}

//user form
export interface IOrderData {
    total: number;
    items: IProduct[];
    email: string;
    phone: string;
    address: string;
    paymentType: IPaymentType;
}

export type IPaymentType = 'online' | 'when received';

export interface IPaymentData {
    paymentType: IPaymentType;
    address: string;
}

export interface IContactData {
    email: string;
    phone: string;
}

//api call
export interface IApiClient {
get<T>(url: string): Promise<T>;
post<T>(url: string, data: object): Promise<T>;
}

//basket
export interface IBasketItems extends IProduct {
    index: number;
}

export interface IBasketState {
    items: IBasketItems[];
    totalPrice: number;
}

// basket model methods
export interface IBasketModel {
    getState(): IBasketState;
    addItem(item: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
}

//render
export interface IProductView {
    render(product: IProduct): HTMLElement;
}

export interface IBasketView {
    render(state: IBasketState): HTMLElement;
}

// event emitter
export interface IEventEmitter {
    on(event: string, handler: (data?: unknown) => void): void;
    emit(event: string, data?: unknown): void;
}