import { Cubit } from '../src/cubit';

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
}

describe('Cubit - Basic Operations', () => {
    let cubit: CounterCubit;

    beforeEach(() => {
        cubit = new CounterCubit(0);
    });

    afterEach(() => {
        cubit.unsubscribeAll();
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

        cubit.subscribe((state) => {
            states.push(state);
        });

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

        cubit.subscribe(() => callCount++);
        cubit.increment(); // increments callCount (initial + change = 2)

        cubit.unsubscribeAll();
        cubit.increment(); // should not increment callCount

        setTimeout(() => {
            expect(callCount).toBe(2);
            done();
        }, 50);
    });
});
