import { useEffect } from "react"
import { clearLocalStorage } from "../../utils/localstorage.utility";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function Login() {


	const navigate = useNavigate();

	useEffect(() => {
		clearLocalStorage("token");
		clearLocalStorage("email");
		clearLocalStorage("name");
		clearLocalStorage("ts");

	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const email = (event.currentTarget.elements[0] as HTMLInputElement).value;
		const password = (event.currentTarget.elements[2] as HTMLInputElement).value;

		if(email === "" || password === "") return alert("Los campos no pueden estar vacios");
		
		handleLogin(email, password);
		
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
					<input type="email" id="email" name="email" placeholder="email@gmail.com" />
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" placeholder="*******" />
					<button type="submit">Login</button>
				</form>
			</div>

		</>
	)
}

export default Login