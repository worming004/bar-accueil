import {useAppSelector} from "../../../app/hooks";
import {selectPresentationTokens} from "../counterSlice";

export function OutputPage() {
    const tokens = useAppSelector(selectPresentationTokens)
    const tokensHtml = tokens.map(t => (<div key={t.name}>{t.name}: {t.count}</div>))
    return (<div>
        {tokensHtml}
    </div>)
}