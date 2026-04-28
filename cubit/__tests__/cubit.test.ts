import { Cubit } from '../src/cubit';
import { Subscription } from 'rxjs';

class CounterCubit extends Cubit<number> {
    constructor(state: number = 0) {
        super(state);
    }

    public increment(): void {
        this.emit(this.state() + 1);
    }

    public decrement(): void {
        this.emit(this.state() - 1);
    }

    public add(value: number): void {
        this.emit(this.state() + value);
    }
}

describe('Cubit - Basic Operations', () => {
    let cubit: CounterCubit;
    let subscriptions: Subscription[] = [];

    beforeEach(() => {
        cubit = new CounterCubit(0);
        subscriptions = [];
    });

    afterEach(() => {
        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
    });

    it('should initialize with initial state', () => {
        expect(cubit.state()).toBe(0);
    });

    it('should increment state', () => {
        cubit.increment();
        expect(cubit.state()).toBe(1);
    });

    it('should decrement state', () => {
        cubit.increment();
        cubit.decrement();
        expect(cubit.state()).toBe(0);
    });

    it('should emit state to subscribers', (done) => {
        const states: number[] = [];

        const sub = cubit.subscribe((state) => {
            states.push(state);
        });
        subscriptions.push(sub);

        cubit.increment();

        setTimeout(() => {
            expect(states).toEqual([0, 1]);
            done();
        }, 50);
    });

    it('should return observable stream', () => {
        const stream = cubit.stream();
        expect(stream).toBeDefined();
        expect(typeof stream.subscribe).toBe('function');
    });

    it('should unsubscribe all listeners', (done) => {
        let callCount = 0;

        const sub = cubit.subscribe(() => callCount++);
        subscriptions.push(sub);
        cubit.increment();

        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
        cubit.increment();

        setTimeout(() => {
            expect(callCount).toBe(2);
            done();
        }, 50);
    });

    it('should throw error when stream is closed', () => {
        // Access the private _stateStream and mark it as "closed" by calling complete
        const stateStream = (cubit as any)._stateStream;
        const originalClosed = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(stateStream),
            'closed'
        );

        // Create a mock getter that returns true for the closed property
        Object.defineProperty(stateStream, 'closed', {
            get: () => true,
            configurable: true
        });

        expect(() => {
            cubit.emit(99);
        }).toThrow('State stream is closed');

        // Restore original property
        if (originalClosed) {
            Object.defineProperty(stateStream, 'closed', originalClosed);
        }
    });
});

describe('Cubit - Debug Mode', () => {
    let cubit: CounterCubit;
    let subscriptions: Subscription[] = [];

    beforeEach(() => {
        cubit = new CounterCubit(0);
        subscriptions = [];
    });

    afterEach(() => {
        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
    });

    it('should enable debug mode and log state transitions', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        cubit.enableDebug();
        cubit.increment();

        expect(consoleSpy).toHaveBeenCalledWith('Current State:', 0);
        expect(consoleSpy).toHaveBeenCalledWith('Next State:', 1);
        consoleSpy.mockRestore();
    });

    it('should not log when debug is disabled (default)', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        cubit.increment();

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should not log debug when disabled explicitly', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        cubit.enableDebug();
        cubit.increment();

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockClear();

        // Create new cubit with debug not enabled
        const cubit2 = new CounterCubit(5);
        const sub2 = cubit2.subscribe(() => {});
        sub2.unsubscribe();

        cubit2.increment();

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should log multiple state changes when debug enabled', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        cubit.enableDebug();
        cubit.add(5);
        cubit.add(3);

        const calls = consoleSpy.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        expect(calls.some((call) => call[1] === 5)).toBe(true);

        consoleSpy.mockRestore();
    });

    it('should have different behavior with and without debug', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Without debug
        const cubit1 = new CounterCubit(0);
        cubit1.emit(10);
        expect(consoleSpy).not.toHaveBeenCalled();

        // With debug
        const cubit2 = new CounterCubit(0);
        cubit2.enableDebug();
        cubit2.emit(10);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});

describe('Cubit - Middleware', () => {
    let cubit: CounterCubit;
    let subscriptions: Subscription[] = [];

    beforeEach(() => {
        cubit = new CounterCubit(0);
        subscriptions = [];
    });

    afterEach(() => {
        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
    });

    it('should apply single middleware transformation', (done) => {
        cubit.use((state) => state * 2);

        const sub = cubit.subscribe((state) => {
            if (state === 10) {
                expect(state).toBe(10);
                done();
            }
        });
        subscriptions.push(sub);

        cubit.emit(5);
    });

    it('should apply multiple middlewares in order', (done) => {
        const order: string[] = [];

        cubit.use((state) => {
            order.push('m1');
            return state + 1;
        });

        cubit.use((state) => {
            order.push('m2');
            return state * 2;
        });

        const sub2 = cubit.subscribe((finalState) => {
            if (finalState === 12) {
                expect(order).toEqual(['m1', 'm2']);
                expect(finalState).toBe(12);
                done();
            }
        });
        subscriptions.push(sub2);

        cubit.emit(5);
    });

    it('should handle state with no middleware', (done) => {
        const states: number[] = [];

        const sub3 = cubit.subscribe((state) => {
            states.push(state);
        });
        subscriptions.push(sub3);

        cubit.emit(42);

        setTimeout(() => {
            expect(states[states.length - 1]).toBe(42);
            done();
        }, 50);
    });
});

describe('Cubit - Lifecycle Hooks', () => {
    let subscriptions: Subscription[] = [];

    afterEach(() => {
        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
    });

    it('should call beforeEmit hook before state changes', (done) => {
        let beforeEmitCalled = false;

        class HookCubit extends Cubit<number> {
            protected beforeEmit(state: number): void {
                beforeEmitCalled = true;
            }
        }

        const cubit = new HookCubit(0);

        const sub = cubit.subscribe(() => {
            if (beforeEmitCalled) {
                expect(beforeEmitCalled).toBe(true);
                sub.unsubscribe();
                done();
            }
        });
        subscriptions.push(sub);

        cubit.emit(1);
    });

    it('should call afterEmit hook after state changes', () => {
        let afterEmitCalled = false;

        class HookCubit extends Cubit<number> {
            protected afterEmit(state: number): void {
                afterEmitCalled = true;
            }
        }

        const cubit = new HookCubit(0);
        cubit.emit(1);

        expect(afterEmitCalled).toBe(true);
    });

    it('should call both hooks in correct sequence', () => {
        const callOrder: string[] = [];

        class HookCubit extends Cubit<number> {
            protected beforeEmit(state: number): void {
                callOrder.push('before');
            }

            protected afterEmit(state: number): void {
                callOrder.push('after');
            }
        }

        const cubit = new HookCubit(0);
        cubit.emit(1);

        expect(callOrder).toEqual(['before', 'after']);
    });
});

describe('Cubit - Complex Integration', () => {
    let cubit: CounterCubit;
    let subscriptions: Subscription[] = [];

    beforeEach(() => {
        cubit = new CounterCubit(0);
        subscriptions = [];
    });

    afterEach(() => {
        subscriptions.forEach((s) => s && s.unsubscribe());
        subscriptions.length = 0;
    });

    it('should combine middleware and debug', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        cubit.use((state) => state + 10);
        cubit.enableDebug();
        cubit.emit(5);

        // Debug logs BEFORE middleware is applied
        expect(consoleSpy).toHaveBeenCalledWith('Current State:', 0);
        expect(consoleSpy).toHaveBeenCalledWith('Next State:', 5);
        // But the final state should be transformed by middleware: 5 + 10 = 15
        expect(cubit.state()).toBe(15);
        consoleSpy.mockRestore();
    });

    it('should handle middleware with subscribe', (done) => {
        const states: number[] = [];

        cubit.use((state) => Math.max(0, state));
        const sub = cubit.subscribe((state) => {
            states.push(state);
        });
        subscriptions.push(sub);

        cubit.emit(-5);
        cubit.emit(10);

        setTimeout(() => {
            expect(states).toContain(0);
            expect(states).toContain(10);
            done();
        }, 50);
    });

    it('should handle rapid sequential emits', (done) => {
        const states: number[] = [];

        const sub2 = cubit.subscribe((state) => {
            states.push(state);
        });
        subscriptions.push(sub2);

        cubit.add(1);
        cubit.add(2);
        cubit.add(3);

        setTimeout(() => {
            expect(states).toEqual([0, 1, 3, 6]);
            done();
        }, 50);
    });
});
