import {useAppSelector} from "../../../app/hooks";
import {selectPresentationAmount, selectPresentationTokens, TokenWithCount} from "../counterSlice";
import {GetTokenColor} from "../../tokens";

export function OutputPage() {
    const tokens = useAppSelector(selectPresentationTokens);
    const amount = useAppSelector(selectPresentationAmount);
    const tokensHtml = tokens.map(TokenPresentation)
    return (<>
        <div className="flew flex-wrap">
            {tokensHtml}
        </div>
        <AmountPresentation amount={amount}></AmountPresentation>
    </>)
}

function TokenPresentation(props: TokenWithCount) {
    const commonStyle = {
        fontSize: '35px',
        width: "100px",
        height: "100px",
        margin: "25px",
        backgroundColor: GetTokenColor(props)
    }
    const roundStyle = {
        ...commonStyle,
        alignItems: 'flex-start',
    }
    const cardStyle = {
        ...commonStyle
    }
    const commonClass = 'flex h-screen '
    const roundClass = commonClass + 'rounded-full'
    const cardClass = commonClass + ''
    const elementClassName = 'm-auto'

    const selectedStyle = props.shape === 'round' ? {
        style: roundStyle,
        class: roundClass
    } : props.shape === 'card' ? {
        style: cardStyle,
        class: cardClass
    } : undefined
    return (
        <div
            key={props.name}
            style={selectedStyle?.style}
            className={selectedStyle?.class}
        >
            <span className={elementClassName}>{props.count}</span>
        </div>)
}

function AmountPresentation(props: { amount: number }) {
    return (<>
        <h1 className='text-4xl'>Montant:</h1>
        <span className='text-4xl'>{props.amount.toFixed(2)}</span>
    </>)
}