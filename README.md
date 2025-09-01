# Описание проекта

Учебный проект «Web Larek» описывает приложение для покупки различных товаров, полученных посредством вызовов API, и обработки данных пользователя во время оформления заказа.

Архитектура проекта
Этот проект следует шаблону MVP (Model - View - Presenter):

**Model**: обрабатывает всю бизнес-логику и операции с данными.

**View**: отвечает исключительно за рендеринг пользовательского интерфейса и обнаружение пользовательского ввода.

**Presenter**: выступает посредником между моделью и представлением.


# Инструкция по сборке и запуску

Первый шаг для настройки этого проекта — клонирование репозитория из git: 
git clone https://github.com/username/web-larek-frontend.git

После клонирования проекта установить зависимости:
```
npm install
```

Для запуска проекта в режиме разработки выполнить команду:
```
npm run start
```

Для сборки проекта используется команда:
```
npm run build
```

Собранные файлы будут находиться в папке "dist/".


# Типы данных 

Все типы, используемые в проекте, описаны как интерфейсы. Они находятся в файле [src/types/index.ts](src/types/index.ts)

- **IProduct** — описание товара
- **IOrderData** — данные заказа
- **TPaymentType** — тип оплаты
- **IPaymentData** — данные для выбора тип оплаты и адреса
- **IContactData** — контактные данные
- **IApiClient** — запросы API
- **IBasketItem** — товар в корзине для нумерации
- **IBasketState** — состояние корзины
- **IbasketModel** — содержит методы взаимодействия с корзиной в Model
- **IProductView** — Используется для отображения продуктов на странице в View
- **IBasketView** — Используется для отображения корзины на странице в View
- **IEventEmitter** — Слушател событие
- **IComponent** — Интерфейс базового компонента
- **IProduct** — Структура данных о товаре
- **IEventEmitter** — Контракт системы событий
- **IAppEvents** — Все используемые события для подключения модулей

# Документация классов
## Model
### basketModel

Модель корзины

**Поля**

-state: IBasketState - текущее состояние корзины с товарами и общей суммой (sorry, the translator did this)

-products: Product[] - ссылка на доступные товары

**Методы**

-getState(): IBasketState — возвращает текущее состояние корзины

-addItem(product: IProduct): void — добавляет товар в корзину с проверкой

-removeItem(id: string): void — удаляет товар из корзины по идентификатору

-isInBasket(productId: string): boolean — проверяет, есть ли товар в корзине

-getItemCount(): number — возвращает количество товаров в корзине

### productModel

Модель, управляющая загрузкой и управлением данными о товарах.

**Поля**

-products: IProduct[] — массив всех загруженных товаров

-api: Api — экземпляр клиента API

**Методы**

-loadProducts(): Promise<IProduct[]> — загрузка товаров с сервера

-getProductById(id: string): IProduct | undefined — поиск товара по идентификатору

-getProducts(): IProduct[] — возврат всех товаров

-getProductsByCategory(category: string): IProduct[] — фильтрация товаров по категории

### orderModel

Модель, обрабатывающая проверку заказа и отправку его на сервер.

**Поля**

-api: API — клиентский экземпляр API для взаимодействия с сервером

-basketModel: BasketModel — ссылка на корзину для данных заказа

**Методы**

-validateOrderData(formData: IOrderData): string[] — проверяет поля формы заказа

-submitOrder(formData: IOrderData): Promise<IOrderResponse> — отправляет заказ на сервер

## View
### card

компонент для отображения товаров

**Поля**

-template: HTMLTemplateElement — HTML-шаблон для рендеринга

-container: HTMLElement — элемент-контейнер DOM

**Методы**

-renderGallery(product: IProduct): HTMLElement — отображает товар для основной галереи

-renderPreview(product: IProduct, isInBasket: boolean): HTMLElement — отображает предварительный просмотр товара в модальном окне

-renderBasket(item: IBasketItem): HTMLElement — отображает товар в списке корзины

-setPrice(element: HTMLElement, price: number | null): void — форматирует отображение цены

### basket

Компонент отображения товары и сумму в карзине.

**Поля**

-basketList: HTMLElement — элемент UL для товаров в корзине

-basketTotal: HTMLElement — элемент, отображающий общую стоимость

-checkoutButton: HTMLButtonElement — кнопка оформления заказа

-emptyMessage: HTMLElement — сообщение о пустой корзине

**Методы**

-render(state: IBasketState): HTMLElement — обновляет отображение корзины

-setLoading(isLoading: boolean): void — отображает состояние загрузки во время оформления заказа

-showError(message: string): void — отображает сообщение об ошибке

-clearError(): void — удаляет сообщение об ошибке

### productList

Компонент галереи товаров

**Поля**

-cardComponent: Card — компонент карточки для отображения товаров

-container: HTMLElement — элемент-контейнер галереи

**Методы**

-render(products: IProduct[]): HTMLElement — отображает галерею товаров

-showError(message: string): void — отображает сообщение об ошибке

### modal

Компонент управления модальным окном

**Поля**

-contentContainer: HTMLElement — область содержимого модального окна

-closeButton: HTMLButtonElement — кнопка закрытия модального окна

**Методы**

-open(content: HTMLElement): void — открывает модальное окно с содержимым

-close(): void — закрывает модальное окно

-setVisible(isVisible: boolean): void — отображает/скрывает модальное окно

### Header

Управление значком корзины и отображением счетчика товаров

**Поля**

-cartCountElement: HTMLElement — элемент, отображающий количество товаров в корзине.

-cartButton: HTMLButtonElement — элемент кнопки со значком корзины.

-itemCount: number — текущее количество товаров в корзине.

**Методы**

-updateCartCount(): void - updates cart counter display

-setupEventListeners(): void - handles cart button clicks and basket updates

### paymentForm and contactForm

Компонент формы для выбора способа оплаты, адреса доставки и контактной информации пользователя.

**Методы**

-validateForm(errorElement: HTMLElement): void — проверяет форму и выводит ошибки

-isValid(): boolean — проверяет, заполнена ли форма коректно

-getData(): {payment: TPaymentType; address: string} — возвращает данные формы

### orderSuccess

Компонент для последнего модального окна «успех»

**Поля**

-orderIdElement: HTMLElement - element displaying order ID

-totalElement: HTMLElement - element displaying order total

-closeButton: HTMLButtonElement - close modal button

**Методы**

## Component

Базовый класс, обеспечивающий общую функциональность для всех компонентов.

**Методы**

-render(...args: unknown[]): HTMLElement — рендерит компонент (абстрактный)

-setVisible(isVisible: boolean): void — показывает/скрывает компонент

-setDisabled(isDisabled: boolean): void — включает/отключает компонент

-setText(element: HTMLElement, value: string): void — устанавливает текст элемента

-setImage(element: HTMLImageElement, src: string, alt?: string): void — устанавливает источник изображения

## Presenter 

main app (не сделано еще)