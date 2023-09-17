import { useAppSelector } from "../../../app/hooks";
import { store } from "../../../app/store";
import { resetSelection, selectPresentationAmount, tokenMode, amountReceived, selectAmountToGiveBack, selectPresentationAmountReceived, resetAmountReceived } from "../counterSlice";

export function ReturnPage() {
  const amountToPay = useAppSelector(selectPresentationAmount);
  const amountReceivedValue = useAppSelector(selectPresentationAmountReceived);
  const toGiveBack = useAppSelector(selectAmountToGiveBack)
  const style = {
    fontSize: "35px",
  }
  const controlClasses = "border-4 m-5 p-4 left-0"
  const isWarning = toGiveBack < 0;
  const retourColor = isWarning ? { color: "red" } : {};

  const toTokenModeClick = () => store.dispatch(tokenMode());
  const resetAndToTokenMode = () => {
    store.dispatch(resetSelection());
    store.dispatch(resetAmountReceived());
    store.dispatch(tokenMode());
  }
  const valueReceivedHandler = (val: React.ChangeEvent<HTMLInputElement>) => {
    store.dispatch(amountReceived(+val.target.value))
  }
  return (
    <>
      <span className='text-4xl'>Montant: </span>
      <span className='text-4xl'>{amountToPay.toFixed(2)}€</span>
      <br />
      <label htmlFor="recu" className='text-4xl'>Reçu: </label>
      <input type='number' step=".01" id='recu' className={controlClasses} onChange={(evt) => { valueReceivedHandler(evt) }} defaultValue={amountReceivedValue}></input>
      <br />
      <span className='text-4xl'>Retour: </span>
      <div><span className='text-4xl' style={retourColor}>{toGiveBack.toFixed(2)}€</span></div>
      <button className={controlClasses} style={style} onClick={() => { resetAndToTokenMode() }}>Valider et réinitialiser</button>
      <button className={controlClasses} style={style} onClick={() => { toTokenModeClick() }}>Modifier la commande</button>
    </>
  )
}

