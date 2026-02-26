import { Cubit } from "../src/cubit";
import { State } from "../src/state";


describe('Integration - Cubit and State', () => {
    it('should work with simple number state', (done) => {
        class CounterCubit extends Cubit<number> {
            public add(value: number): void {
                this.emit(this.state() + value);
            }
        }

        const cubit = new CounterCubit(0);
        const states: number[] = [];

        cubit.subscribe((state) => states.push(state));
        cubit.add(5);
        cubit.add(3);

        setTimeout(() => {
            expect(states).toEqual([0, 5, 8]);
            cubit.unsubscribeAll();
            done();
        }, 50);
    });

    it('should work with complex object state', (done) => {
        interface User {
            name: string;
            age: number;
        }

        class UserState extends State<User> {
            constructor(user: User) {
                super(user);
            }
        }

        class UserCubit extends Cubit<UserState> {
            public updateName(name: string): void {
                const current = this.state().value();
                this.emit(new UserState({ ...current, name }));
            }
        }

        const cubit = new UserCubit(new UserState({ name: 'Alice', age: 30 }));
        const names: string[] = [];

        cubit.subscribe((state) => {
            names.push(state.value().name);
        });

        cubit.updateName('Bob');

        setTimeout(() => {
            expect(names).toEqual(['Alice', 'Bob']);
            cubit.unsubscribeAll();
            done();
        }, 50);
    });

    it('should apply middleware transformations', (done) => {
        class ProcessingCubit extends Cubit<number> {
            constructor() {
                super(0);
                // Middleware: double the value
                this.use((state) => state * 2);
            }
        }

        const cubit = new ProcessingCubit();
        const states: number[] = [];

        cubit.subscribe((state) => states.push(state));
        cubit.emit(5); // Will be doubled to 10

        setTimeout(() => {
            expect(states[states.length - 1]).toBe(10);
            cubit.unsubscribeAll();
            done();
        }, 50);
    });

    it('should handle debug mode', (done) => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        class DebugCubit extends Cubit<number> {
            public set(value: number): void {
                this.emit(value);
            }
        }

        const cubit = new DebugCubit(0);
        cubit.enableDebug();
        cubit.set(42);

        setTimeout(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Current State:', 0);
            expect(consoleSpy).toHaveBeenCalledWith('Next State:', 42);
            consoleSpy.mockRestore();
            cubit.unsubscribeAll();
            done();
        }, 50);
    });
});
