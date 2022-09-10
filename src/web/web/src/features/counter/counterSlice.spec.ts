import counterReducer, {
    CounterState,
    addItem, addItemsByBatch, executeSelection, setModeTo, Action,
} from './counterSlice';

const dummyItem = {
    name: 'coca'
}
const anotherDummyItem = {
    name: 'beer'
};

describe('counter reducer', () => {
    const initialState: CounterState = {
        items: [],
        actions: [],
        mode: "Add"
    };

    const selectionAddCoca: Action = {item: dummyItem, operation: 'Add'}

    it('should handle initial state', () => {
        expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
            items: [],
            actions: [],
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
        expect(intermediateState.actions.length).toEqual(0);
        const finalStep = counterReducer(intermediateState, executeSelection(dummyItem));

        expect(finalStep.actions.length).toEqual(1);
        expect(finalStep.actions[0]).toEqual({item: dummyItem, operation: 'Add'});
    })

    it('should should change mode', () => {
        const state = counterReducer(initialState, setModeTo('Subtract'));
        expect(state.mode).toEqual('Subtract')
        const secondState = counterReducer(initialState, setModeTo('Add'));
        expect(secondState.mode).toEqual('Add')
    })

    it('should decrease counter by item', () => {
        const initialStateWithSingleSelection = {...initialState, actions: [selectionAddCoca, selectionAddCoca]}
        expect(initialStateWithSingleSelection).toEqual({
            items: [],
            actions: [selectionAddCoca, selectionAddCoca],
            mode: "Add"
        })
        const intermediateState = counterReducer(initialStateWithSingleSelection, setModeTo('Subtract'));
        expect(intermediateState.actions.length).toEqual(2);
        const finalStep = counterReducer(intermediateState, executeSelection(dummyItem));
        expect(finalStep.actions.length).toEqual(3);
        expect(finalStep.actions[0]).toEqual({item: dummyItem, operation: 'Add'});
        expect(finalStep.actions[2]).toEqual({item: dummyItem, operation: 'Subtract'});
    })
});
