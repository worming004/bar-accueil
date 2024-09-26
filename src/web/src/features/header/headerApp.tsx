import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { store } from "../../app/store";
import { authenticate, logoff, selectUserIsAuthenticated } from "../counter/counterSlice";
import { useAppSelector } from "../../app/hooks";
import { getBufferByEnv } from "../buffer/buffer";

const pb = new PocketBase('https://pocketbase.bar.craftlabit.be');
//const pb = new PocketBase('http://localhost:8090');

function HeaderApp(props: any) {

  const userIsAuthenticated = useAppSelector(selectUserIsAuthenticated);

  const [password, setPassword] = useState('');
  async function handleLogin() {
    try {
      const { token } = await pb.collection('users').authWithPassword("bar", password);
      store.dispatch(authenticate(token));
      const buffer = getBufferByEnv();
      buffer.setToken(token);
    } catch (e) {
      alert("Login failed")
    }
  }

  function handlePasswordValue(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  const [clickCount, setClickCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25); // 25 seconds timer
  const [timerActive, setTimerActive] = useState(false);
  const onTwentyClicks = () => {
    alert('You clicked 20 times in 25 seconds! This is hidden command for logout');
    // set
    store.dispatch(logoff());
    setClickCount(0);
    setTimerActive(false);
    setTimeRemaining(25);
  };

  const handleClick = () => {
    if (!timerActive) {
      setTimerActive(true); // Start timer on first click
    }
    setClickCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    let timer: NodeJS.Timer | undefined;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Reset if time is over
    if (timeRemaining === 0) {
      setClickCount(0);
      setTimerActive(false);
      setTimeRemaining(25);
    }

    // Cleanup the interval on unmount or when the timer stops
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    if (clickCount === 20) {
      onTwentyClicks();
    }
  }, [clickCount]);

  const authStyle = { fontSize: 'x-small' }
  const passwordStyle = { border: '1px solid black' }

  const authText = userIsAuthenticated ? <h5 onClick={handleClick} style={authStyle}> User is authenticated</h5> :
    <>
      <input type="password" name="password" onChange={handlePasswordValue} style={passwordStyle} />
      <button onClick={handleLogin}>Login</button>
    </>


  return (
    <div>
      {authText}
    </div>
  );
}

export default HeaderApp;

