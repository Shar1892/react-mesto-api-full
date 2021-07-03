import { useState } from "react";

const Login = ({ onLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleChangeEmail = (evt) => {
		setEmail(evt.target.value);
	};

	const handleChangePassword = (evt) => {
		setPassword(evt.target.value);
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		onLogin(email, password);
	};

	return (
		<form className="auth-form" name="ligin" onSubmit={handleSubmit}>
			<h2 className="auth-form__title">Вход</h2>
			<input
				type="email"
				id="email"
				className="auth-form__input"
				name="email"
				placeholder="Email"
				value={email}
				onChange={handleChangeEmail}
				minLength="2"
				maxLength="40"
				required
			/>
			<input
				type="password"
				id="password"
				className="auth-form__input"
				name="password"
				placeholder="Пароль"
				value={password}
				onChange={handleChangePassword}
				minLength="2"
				maxLength="40"
				required
			/>
			<button type="submit" className="auth-form__register-button">
				Войти
			</button>
		</form>
	);
};

export default Login;
