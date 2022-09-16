import {useAppSelector} from "../../../app/hooks";
import {selectPresentationAmount, selectPresentationTokens} from "../counterSlice";

export function OutputPage() {
    const tokens = useAppSelector(selectPresentationTokens);
    const amount = useAppSelector(selectPresentationAmount).toFixed(2);
    const tokensHtml = tokens.map(t => (<div key={t.name}>{t.name}: {t.count}</div>))
    return (<div>
        <h2>tokens:</h2>
        {tokensHtml}
        <h2>amount:</h2>
        {amount}
    </div>)
}