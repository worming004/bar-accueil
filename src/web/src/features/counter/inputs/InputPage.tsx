import {
  executeSelection,
  selectPresentationItems,
  switchModeTo,
  undo,
  resetSelection,
  selectTokenMode, ItemWithCount, FeatureFlag, selectFeatureFlag, paymentMode
} from "../counterSlice";
import { useAppSelector } from "../../../app/hooks";
import { store } from "../../../app/store";
import { GetItemColor } from "../../items";
import { Mode } from "fs";

function Control(props: any) {
  const undoClick = () => store.dispatch(undo())
  const resetClick = () => store.dispatch(resetSelection())
  const paymentClick = () => store.dispatch(paymentMode())
  const switchModeToClick = () => store.dispatch(switchModeTo())
  const featureFlags: FeatureFlag = props.featureFlags;
  const commonMathSignStyle = {
    transition: 'color 0.2s',
  }
  const plusStyle = {
    ...commonMathSignStyle,
    color: props.mode === 'Add' ? 'black' : 'slategray'
  }
  const minusStyle = {
    ...commonMathSignStyle,
    color: props.mode === 'Subtract' ? 'black' : 'slategray'
  }

  const resetStyle = {
    fontSize: "35px",
  }
  const controlClasses = "border-4 m-5 p-4 left-0"

  return (
    <>
      <button style={resetStyle} className={controlClasses} onClick={resetClick}>Reset</button>
      <button style={resetStyle} className={controlClasses} onClick={paymentClick}>Paiement</button>
      {featureFlags?.showUndo ? <button style={resetStyle} className={controlClasses} onClick={undoClick}>Undo</button> : null}
      <button style={resetStyle} className={controlClasses} onClick={switchModeToClick}>
        <span style={plusStyle} className="m-4">+</span>
        <span style={minusStyle} className="m-4">-</span>
      </button>
    </>);
}

export function InputPage() {
  const tokenMode = useAppSelector(selectTokenMode)
  const inputs = useAppSelector(selectPresentationItems)
  const featureFlags = useAppSelector(selectFeatureFlag)
  const inputsHtml = inputs.map(i => SingleButton(i, tokenMode))
  return (
    <>
      <div className="flex flex-wrap">
        {inputsHtml}
      </div>
      <div>
        <Control mode={tokenMode} featureFlags={featureFlags}></Control>
      </div>
    </>)
}

function SingleButton(props: ItemWithCount, mode: Mode) {
  const dispatchItem = () => store.dispatch(executeSelection(props))

  const widthSquareSize = props.size === "demi" ? "54px" : "108px";
  const heightSquareSize = "108px";
  const cardStyle: any = {
    backgroundColor: GetItemColor(props),
    width: widthSquareSize,
    height: heightSquareSize,
    margin: "18px",
    padding: "5px",
    position: 'relative' as 'relative'
  };
  if (mode === 'Subtract') {
    cardStyle.border = '3px solid red'
  }
  const textStyle = {
    fontSize: "18px",
    flexShrink: 0,
  }
  const countStyle = {
    bottom: '0px',
    right: '0px',
    position: 'absolute' as 'absolute',
    fontSize: '22px',
    margin: '2px'
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
