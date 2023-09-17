import { useAppSelector } from "../../../app/hooks";
import { store } from "../../../app/store";
import { reset, selectPresentationAmount, tokenMode } from "../counterSlice";

export function ReturnPage() {
  const amount = useAppSelector(selectPresentationAmount);
  const style = {
    fontSize: "35px",
  }
  const controlClasses = "border-4 m-5 p-4 left-0"

  const toTokenModeClick = () => store.dispatch(tokenMode());
  const resetAndToTokenMode = () => {
    store.dispatch(reset());
    store.dispatch(tokenMode());
  }
  return (
    <>
      <span className='text-4xl'>Montant: </span>
      <span className='text-4xl'>{amount.toFixed(2)}€</span>
      <br />
      <label htmlFor="recu" className='text-4xl'>Reçu: </label>
      <input type='number' id='recu' className={controlClasses} ></input>
      <br />
      <span className='text-4xl'>Retour:</span>
      <span className='text-4xl'>{amount.toFixed(2)}€</span>
      <button className={controlClasses} style={style} onClick={() => { toTokenModeClick() }}>Retour</button>
      <button className={controlClasses} style={style} onClick={() => { resetAndToTokenMode() }}>Valider</button>
    </>
  )
}
