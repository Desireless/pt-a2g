/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react"
import { clearLocalStorage } from "../../utils/localstorage.utility";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function Login() {

	// para evitar el re-render, opté por el uso de useRef
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	useEffect(() => {

		if(authService.isValidToken()){
			navigate("/dashboard", { replace: true });
		}else{

			clearLocalStorage("token");
			clearLocalStorage("email");
			clearLocalStorage("name");
			clearLocalStorage("ts");
		}


	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// si es undefined o null evitar la ejecucion
		if(!emailRef.current || !passwordRef.current){
			//Mostrar error
			return;
		}

		if(emailRef.current.value === "" || passwordRef.current.value === ""){
			//Mostrar error
			return;
		}
		
		handleLogin(emailRef.current.value, passwordRef.current.value);
		
	}

	const handleLogin = async (email:string, password:string) => {
		const response = await authService.signIn(email, password);
		if (response.ok) {
			navigate("/dashboard", { replace: true });
		}else{
			console.log("Error al iniciar sesión");
		}
	}

	return (
		<>
			<h1>Login</h1>
			<div className="login-container">
				<form onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" placeholder="email@gmail.com" ref={emailRef}/>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" placeholder="*******" ref={passwordRef}/>
					<button type="submit">Login</button>
				</form>
			</div>

		</>
	)
}

export default Login