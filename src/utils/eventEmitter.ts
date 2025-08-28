import { IEventEmitter, TAppEvent } from '../types/index';

class EventEmitter implements IEventEmitter {
    private events: Map<TAppEvent, Function[]> = new Map();

    on<T>(event: TAppEvent, handler: (data?: T) => void): void {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event)!.push(handler);
    }

    emit<T>(event: TAppEvent, data?: T): void {
        this.events.get(event)?.forEach(handler => handler(data));
    }
}

export const eventEmitter = new EventEmitter();