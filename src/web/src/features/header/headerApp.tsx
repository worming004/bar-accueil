function HeaderApp(props: { userIsAuthenticated: boolean }) {

  function handleLogin(formData: FormData) {
    formData.preventDefault();
    const target = formData.target as any;
    const password = target.password.value;
    alert(password);
  }
  return (
    <div>
      <h1>User is authenticated: {props.userIsAuthenticated}</h1>
      <form action={handleLogin}>
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default HeaderApp;
