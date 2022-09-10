import counterReducer, {
    CounterState,
    addItem, addItemsByBatch, executeSelection,
} from './counterSlice';
import exp from "constants";

const dummyItem = {
    name: 'coca'
}
const anotherDummyItem = {
    name: 'beer'
};

describe('counter reducer', () => {
    const initialState: CounterState = {
        items: [],
        selection: [],
        mode: "Add"
    };

    it('should handle initial state', () => {
        expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
            items: [],
            selection: [],
            mode: "Add",
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

    it('should increase counter by item', () => {
        const intermediateState = counterReducer(initialState, addItem(dummyItem));
        expect(intermediateState.selection.length).toEqual(0);
        const finalStep = counterReducer(intermediateState, executeSelection(dummyItem));

        expect(finalStep.selection.length).toEqual(1);
        expect(finalStep.selection[0]).toEqual({item: dummyItem, count: 1});
    })
});
