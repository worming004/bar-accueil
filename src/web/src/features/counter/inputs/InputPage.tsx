import {
    executeSelection,
    selectPresentationItems,
    switchModeTo,
    undo,
    reset,
    selectPresentationMode, ItemWithCount
} from "../counterSlice";
import {useAppSelector} from "../../../app/hooks";
import {store} from "../../../app/store";
import {GetItemColor} from "../../items";

function Control() {
    const undoClick = () => store.dispatch(undo())
    const resetClick = () => store.dispatch(reset())
    const switchModeToClick = () => store.dispatch(switchModeTo())
    const mode = useAppSelector(selectPresentationMode)
    const commonMathSignStyle = {
        transition: 'color 0.2s',
    }
    const plusStyle = {
        ...commonMathSignStyle,
        color: mode === 'Add' ? 'black' : 'slategray'
    }
    const minusStyle = {
        ...commonMathSignStyle,
        color: mode === 'Subtract' ? 'black' : 'slategray'
    }

    const resetStyle = {
        fontSize: "35px",
    }
    const controlClasses = "border-4 m-8 p-8"
    // TODO bind to feature
    return (
        <>
            <button style={resetStyle} className={controlClasses} onClick={() => resetClick()}>Reset</button>
            <button style={resetStyle} className={controlClasses} onClick={() => undoClick()}>Undo</button>
            <button style={resetStyle} className={controlClasses} onClick={() => switchModeToClick()}>
                <span style={plusStyle} className="m-4">+</span>
                <span style={minusStyle} className="m-4">-</span>
            </button>
        </>);
}

export function InputPage() {
    const inputs = useAppSelector(selectPresentationItems)
    const inputsHtml = inputs.map(SingleButton)
    return (
        <>
            <div className="flex flex-wrap">
                {inputsHtml}
            </div>
            <div>
                <Control></Control>
            </div>
        </>)
}

function SingleButton(props: ItemWithCount) {
    const dispatchItem = () => store.dispatch(executeSelection(props))
    const squareSize = "125px";
    const cardStyle = {
        // TODO: select color with specified property
        backgroundColor: GetItemColor(props),
        width: squareSize,
        height: squareSize,
        margin: "25px",
        padding: "25px",
        position: 'relative' as 'relative'
    };
    const textStyle = {
        fontSize: "20px",
        flexShrink: 0,
    }
    const countStyle = {
        bottom: '0px',
        right: '0px',
        position: 'absolute' as 'absolute',
        fontSize: '25px'
    };
    return (
        <button
            key={props.name}
            onClick={() => dispatchItem()}
            style={cardStyle}
        >
            <span style={textStyle}>{props.name}</span>
            <div style={countStyle} className='m-2'>{props.count}</div>
        </button>)
}