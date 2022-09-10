import counterReducer, {
    CounterState,
    addItem, addItemsByBatch,
} from './counterSlice';

const dummyItem = {
    name: 'coca'
}
const anotherDummyItem = {
    name: 'beer'
};

describe('counter reducer', () => {
    const initialState: CounterState = {
        items: []
    };
    it('should handle initial state', () => {
        expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
            items: []
        });
    });

    it('should handle adding item', () => {
        const actual = counterReducer(initialState, addItem(dummyItem));
        expect(actual.items.length).toEqual(1);
        expect(actual.items[0]).toEqual(dummyItem);
    });

    it('should handle adding item by batch', () => {
        const actual = counterReducer(initialState, addItemsByBatch([dummyItem, anotherDummyItem]));
        expect(actual.items.length).toEqual(2);
        expect(actual.items[0]).toEqual(dummyItem);
        expect(actual.items[1]).toEqual(anotherDummyItem);
    });
});
