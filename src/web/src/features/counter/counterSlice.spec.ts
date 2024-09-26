import counterReducer, {
  executeSelection, setModeTo, Action, Token, initialState, undo, resetSelection,
} from './counterSlice';

function addItem(item: any) {
  return executeSelection(item);
}

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

const selectionAddCoca: Action = { item: cocaItem, operation: 'Add' }

const initialStateWithSingleSelection = {
  ...initialState,
  actions: [selectionAddCoca, selectionAddCoca],
  tokens: [...cocaItem.tokens]
}

const initialStateForTest = { ...initialState, tokens: [blueToken, redToken] };

describe('counter reducer', () => {
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      backend: { userIsAuthenticated: false, token: '' },
      actions: [],
      featureFlag: {
        showUndo: false,
      },
      amountReceived: 0,
      amountToGiveBack: 0,
      presentationMode: "Token",
      tokenMode: "Add",
      tokens: [],
      items: [],
      presentation: {
        tokens: [],
        tokenMode: 'Add',
        items: [],
        amount: 0
      }
    });
  });

  it('should handle adding item', () => {
    const actual = counterReducer(initialStateForTest, addItem(cocaItem));
    expect(actual.actions.length).toEqual(1);
    expect(actual.actions[0].item).toEqual(cocaItem);
  });

  it('should increase counter by item', () => {
    const intermediateState = counterReducer({ ...initialState, tokens: cocaItem.tokens }, addItem(cocaItem));
    expect(intermediateState.actions.length).toEqual(1);
    expect(intermediateState.presentation.amount).toEqual(1.10)

    const finalStep = counterReducer(intermediateState, executeSelection(cocaItem));

    expect(finalStep.actions.length).toEqual(2);
    expect(finalStep.actions[1]).toEqual({ item: cocaItem, operation: 'Add' });
    expect(finalStep.presentation.amount).toEqual(cocaItem.tokens[0].value * 2)
  })

  it('should should toggle mode with Add and Substract', () => {
    const state = counterReducer(initialState, setModeTo('Subtract'));
    expect(state.tokenMode).toEqual('Subtract')
    const secondState = counterReducer(initialState, setModeTo('Add'));
    expect(secondState.tokenMode).toEqual('Add')
  })

  it('should decrease counter with Substract', () => {
    expect(initialStateWithSingleSelection).toEqual({
      backend: { userIsAuthenticated: false, token: '' },
      items: [],
      actions: [selectionAddCoca, selectionAddCoca],
      featureFlag: {
        showUndo: false,
      },
      amountReceived: 0,
      amountToGiveBack: 0,
      presentationMode: "Token",
      tokenMode: "Add",
      tokens: [...cocaItem.tokens],
      presentation: {
        tokens: [],
        tokenMode: 'Add',
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
    const state = counterReducer(initialStateWithSingleSelection, resetSelection());
    expect(state.actions).toHaveLength(0)
  })
});
