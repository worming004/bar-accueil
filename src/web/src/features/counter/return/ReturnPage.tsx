import { useAppSelector } from "../../../app/hooks";
import { store } from "../../../app/store";
import { reset, selectPresentationAmount, tokenMode, amountReceived, selectAmountToGiveBack } from "../counterSlice";

export function ReturnPage() {
  const amount = useAppSelector(selectPresentationAmount);
  const toGiveBack = useAppSelector(selectAmountToGiveBack)
  const style = {
    fontSize: "35px",
  }
  const controlClasses = "border-4 m-5 p-4 left-0"
  const isWarning = toGiveBack < 0;
  const retourColor = isWarning ? { color: "red" } : {};

  const toTokenModeClick = () => store.dispatch(tokenMode());
  const resetAndToTokenMode = () => {
    store.dispatch(reset());
    store.dispatch(tokenMode());
  }
  const valueReceivedHandler = (val: React.ChangeEvent<HTMLInputElement>) => {
    store.dispatch(amountReceived(+val.target.value))
  }
  return (
    <>
      <span className='text-4xl'>Montant: </span>
      <span className='text-4xl'>{amount.toFixed(2)}€</span>
      <br />
      <label htmlFor="recu" className='text-4xl'>Reçu: </label>
      <input type='number' id='recu' className={controlClasses} onChange={(evt) => { valueReceivedHandler(evt) }}></input>
      <br />
      <span className='text-4xl'>Retour: </span>
      <span className='text-4xl' style={retourColor}>{toGiveBack.toFixed(2)}€</span>
      <button className={controlClasses} style={style} onClick={() => { resetAndToTokenMode() }}>Valider</button>
      <button className={controlClasses} style={style} onClick={() => { toTokenModeClick() }}>Changer la commande</button>
    </>
  )
}

