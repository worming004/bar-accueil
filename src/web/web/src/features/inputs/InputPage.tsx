import {selectItems} from "../counter/counterSlice";
import {useAppSelector} from "../../app/hooks";

export function InputPage() {
    const inputs = useAppSelector(selectItems)
    const inputsHtml = inputs.map(i => <h3 key={i.name}>{i.name}</h3>)
    return (<div>
        {inputsHtml}
    </div>)
}