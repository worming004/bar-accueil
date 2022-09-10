import counterReducer, {
    CounterState,
    addItem,
} from './counterSlice';

const dummyItem = {
    name: 'coca'
}

describe('counter reducer', () => {
    const initialState: CounterState = {
        items: []
    };
    it('should handle initial state', () => {
        expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
            items: []
        });
    });

    it('should handle increment', () => {
        const actual = counterReducer(initialState, addItem(dummyItem));
        expect(actual.items.length).toEqual(1);
        expect(actual.items[0]).toEqual(dummyItem);
    });
});
