import { BehaviorSubject, Observable, Subscription } from "rxjs";

export abstract class Cubit<T> {
    private readonly _stateStream: BehaviorSubject<T>;
    private subscriptions: Subscription[] = [];
    private middlewares: Array<(state: T) => T> = [];
    private debug: boolean = false;

    constructor(state: T) {
        this._stateStream = new BehaviorSubject(state);
    }

    public state(): T {
        return this._stateStream.value;
    }

    public emit(state: T): void {
        if (this._stateStream.closed) {
            throw new Error("State stream is closed");
        }

        if (this.debug) {
            console.log("Current State:", this.state());
            console.log("Next State:", state);
        }

        const nextState = this.applyMiddlewares(state);
        this.beforeEmit(nextState);
        this._stateStream.next(nextState);
        this.afterEmit(nextState);
    }

    public stream(): Observable<T> {
        return this._stateStream.asObservable();
    }

    public subscribe(callback: ((state: T) => void)): Subscription {
        const subscription = this.stream().subscribe(callback);
        this.subscriptions.push(subscription);
        return subscription;
    }

    public unsubscribeAll(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    public use(middleware: (state: T) => T): void {
        this.middlewares.push(middleware);
    }

    public enableDebug(): void {
        this.debug = true;
    }

    protected beforeEmit(state: T): void {
        // Hook for before state emit
    }

    protected afterEmit(state: T): void {
        // Hook for after state emit
    }

    private applyMiddlewares(state: T): T {
        return this.middlewares.reduce((currentState, middleware) => middleware(currentState), state);
    }
}