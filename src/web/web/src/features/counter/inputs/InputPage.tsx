import {
    executeSelection,
    Item,
    selectPresentationItems,
    switchModeTo,
    undo,
    reset,
    selectPresentationMode
} from "../counterSlice";
import {useAppSelector} from "../../../app/hooks";
import {store} from "../../../app/store";
import {GetColor} from "../../items";

function Control() {
    const undoClick = () => store.dispatch(undo())
    const resetClick = () => store.dispatch(reset())
    const switchModeToClick = () => store.dispatch(switchModeTo())
    const mode = useAppSelector(selectPresentationMode)
    const plusStyle = {
        color: mode ===  'Add' ? 'black' : 'gray'
    }
    const minusStyle = {
        color: mode ===  'Subtract' ? 'black' : 'gray'
    }

    const resetStyle = {
        fontSize: "35px",
    }
    const controlClasses = "border-4 m-4 p-4"
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
    const style = {}
    return (
        <>
            <div
                className="flex flex-wrap"
                style={style}
            >
                {inputsHtml}
            </div>
            <div>
                <Control></Control>
            </div>
        </>)
}

function SingleButton(props: Item) {
    const dispatchItem = () => store.dispatch(executeSelection(props))
    const cardStyle = {
        // TODO: select color with specified property
        backgroundColor: GetColor(props),
        width: "200px",
        height: "250px",
        margin: "25px",
    };
    const textStyle = {
        fontSize: "35px",
        flexShrink: 0
    }
    return (
        <button
            key={props.name}
            onClick={() => dispatchItem()}
            style={cardStyle}
        >
            <span style={textStyle}>{props.name}</span>
        </button>)
}