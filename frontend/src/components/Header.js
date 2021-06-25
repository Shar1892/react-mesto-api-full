import logo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

const Header = ({ loggedIn, email, onSignOut }) => {
	const path = useLocation().pathname;

	const linkName = `${path === "/signin" ? "Регистрация" : "Войти"}`;
	const pathTo = `${path === "/signin" ? "/signup" : "/signin"}`;

	return (
		<header className="header page__header-margin">
			<img src={logo} alt="Логотип Mesto" className="header__logo" />
			{loggedIn ? (
				<div className="header__container">
					<h2 className="header__email">{email}</h2>
					<Link
						to="/signin"
						className="header__link header__link_type_out"
						onClick={onSignOut}
					>
						Выход
					</Link>
				</div>
			) : (
				<Link to={pathTo} className="header__link header__link_type_in">
					{linkName}
				</Link>
			)}
		</header>
	);
};

export default Header;
