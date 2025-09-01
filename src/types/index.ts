export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    category: string;
}

export interface IBasketState { //cart
    items: IBasketItem[];
    total: number;
}

export interface IBasketItem extends IProduct { //for indexing in thee cart
    index: number;
}

export type TPaymentType = 'online' | 'cash';

export interface IOrderData { //entire order data
    total: number;
    items: string[];
    email: string;
    phone: string;
    address: string;
    payment: TPaymentType;
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IContactData {
    email: string;
    phone: string;
}

export interface IApiListResponse<T> { //api response
    total: number;
    items: T[];
}

export interface IApiError {
    error: string;
}

export interface IApiClient {
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';


export interface IBasketModel {
    getState(): IBasketState;
    addItem(item: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
}

export interface IProductView {
    render(product: IProduct): HTMLElement;
}

export interface IBasketView {
    render(state: IBasketState): HTMLElement;
}

// method for components
export interface IComponent {
    render(...args: unknown[]): HTMLElement;
    setVisible(isVisible: boolean): void;
    setDisabled(isDisabled: boolean): void;
}

// all eevents 
export type TAppEvent =
    | 'product:preview'
    | 'basket:add'
    | 'basket:remove'
    | 'basket:changed'
    | 'checkout:start'
    | 'modal:closed'
    | 'catalog:loaded'
    | 'catalog:error'
    | 'order:success'
    | 'order:error'
    | string;


export interface IEventEmitter {
    on<T>(event: TAppEvent, handler: (data?: T) => void): void;
    emit<T>(event: TAppEvent, data?: T): void;
}

// form errors
export type TFormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IAppEvents {
    'product:preview': string;
    'basket:add': string;
    'basket:remove': string;
    'basket:changed': IBasketState;
    'basket:itemCount': number;
    'basket:totalUpdated': number;
    'checkout:start': void;
    'checkout:processing': void;
    'checkout:complete': IOrderResponse;
    'checkout:error': string;
    'modal:closed': void;
    'catalog:loaded': IProduct[];
    'catalog:error': string;
    'order:success': IOrderResponse;
    'order:error': IApiError;
    'error': string;
}