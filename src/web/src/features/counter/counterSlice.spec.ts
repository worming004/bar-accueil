import counterReducer, {
  addItem, addItemsByBatch, executeSelection, setModeTo, Action, Token, initialState, undo, reset,
} from './counterSlice';

const blueToken: Token = {
  name: 'blue',
  value: 1.10,
  shape: 'round',
  displayColor: 'blue'
}
const redToken: Token = {
  name: 'red',
  value: 1.80,
  shape: 'round',
  displayColor: 'red'
}

const cocaItem = {
  name: 'coca',
  tokens: [blueToken]
}
const anotherDummyItem = {
  name: 'beer',
  tokens: [redToken]
};

const selectionAddCoca: Action = { item: cocaItem, operation: 'Add' }

const initialStateWithSingleSelection = {
  ...initialState,
  actions: [selectionAddCoca, selectionAddCoca],
  tokens: [...cocaItem.tokens]
}

describe('counter reducer', () => {

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      featureFlag: {
        showUndo: false,
      },
      actions: [],
      mode: "Add",
      tokens: [],
      presentation: {
        tokens: [],
        mode: 'Add',
        items: [],
        amount: 0
      }
    });
  });

  it('should handle adding item', () => {
    const actual = counterReducer(initialState, addItem(cocaItem));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0]).toEqual(cocaItem);
  });

  it('should handle adding item by batch', () => {
    const actual = counterReducer(initialState, addItemsByBatch([cocaItem, anotherDummyItem]));
    expect(actual.items.length).toEqual(2);
    expect(actual.items[0]).toEqual(cocaItem);
    expect(actual.items[1]).toEqual(anotherDummyItem);
  });

  it('should increase counter by item', () => {
    const intermediateState = counterReducer({ ...initialState, tokens: cocaItem.tokens }, addItem(cocaItem));
    expect(intermediateState.actions.length).toEqual(0);
    expect(intermediateState.presentation.amount).toEqual(0)

    const finalStep = counterReducer(intermediateState, executeSelection(cocaItem));

    expect(finalStep.actions.length).toEqual(1);
    expect(finalStep.actions[0]).toEqual({ item: cocaItem, operation: 'Add' });
    expect(finalStep.presentation.amount).toEqual(cocaItem.tokens[0].value)
  })

  it('should should change mode', () => {
    const state = counterReducer(initialState, setModeTo('Subtract'));
    expect(state.mode).toEqual('Subtract')
    const secondState = counterReducer(initialState, setModeTo('Add'));
    expect(secondState.mode).toEqual('Add')
  })

  it('should decrease counter by item', () => {

    expect(initialStateWithSingleSelection).toEqual({
      items: [],
      actions: [selectionAddCoca, selectionAddCoca],
      featureFlag: {
        showUndo: false,
      },
      mode: "Add",
      tokens: [...cocaItem.tokens],
      presentation: {
        tokens: [],
        mode: 'Add',
        items: [],
        amount: 0
      }
    })
    const intermediateState = counterReducer(initialStateWithSingleSelection, setModeTo('Subtract'));
    expect(intermediateState.actions.length).toEqual(2);
    expect(intermediateState.presentation.tokens.find(t => t.name === cocaItem.tokens[0].name)?.count).toEqual(2)
    expect(intermediateState.presentation.amount).toEqual(cocaItem.tokens[0].value * 2)
    const finalStep = counterReducer(intermediateState, executeSelection(cocaItem));
    expect(finalStep.actions.length).toEqual(3);
    expect(finalStep.actions[0]).toEqual({ item: cocaItem, operation: 'Add' });
    expect(finalStep.actions[1]).toEqual({ item: cocaItem, operation: 'Add' });
    expect(finalStep.actions[2]).toEqual({ item: cocaItem, operation: 'Subtract' });

    expect(finalStep.presentation.tokens.find(t => t.name === cocaItem.tokens[0].name)?.count).toEqual(1)
    expect(finalStep.presentation.amount).toEqual(cocaItem.tokens[0].value)
  })

  it('should undo latest action', () => {
    expect(initialStateWithSingleSelection.actions).toHaveLength(2)
    const state = counterReducer(initialStateWithSingleSelection, undo());
    expect(state.actions).toHaveLength(1)
  })

  it('should reset all actions', () => {
    expect(initialStateWithSingleSelection.actions).toHaveLength(2)
    const state = counterReducer(initialStateWithSingleSelection, reset());
    expect(state.actions).toHaveLength(0)
  })
});
