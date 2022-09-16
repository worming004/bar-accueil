import {executeSelection, Item, selectPresentationItems} from "../counterSlice";
import {useAppSelector} from "../../../app/hooks";
import {store} from "../../../app/store";

export function InputPage() {
    const inputs = useAppSelector(selectPresentationItems)
    const inputsHtml = inputs.map(SingleButton)
    const style = {
    }
    return (
        <div
            className="flex flex-wrap"
            style={style}
        >
            {inputsHtml}
        </div>)
}

function SingleButton(props: Item) {
    const dispatchItem = () => store.dispatch(executeSelection(props))
    const cardStyle = {
        // TODO: select color with specified property
        backgroundColor: props.tokens[0]?.name ?? "#f1f1f1",
        width: "200px",
        height: "250px",
        margin: "25px",
    };
    const textStyle = {
        overflow: "hide",
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