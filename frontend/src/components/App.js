import { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import * as mestoAuth from "../utils/mestoAuth.js";

const App = () => {
	const [currentUser, setCurrentUser] = useState({});

	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
	const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
	const [isSuccessfulRegistration, setIsSuccessfulRegistration] =
		useState(false);
	const [successfulmessage, setSuccessfulmessage] = useState("");

	const [selectedCard, setSelectedCard] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState("");

	const [cards, setCards] = useState([]);

	const history = useHistory();

	useEffect(() => {
		if (loggedIn) {
			api
				.getUser()
				.then((userData) => {
					setCurrentUser(userData);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [loggedIn]);

	const handleEditAvatarClick = () => {
		setIsEditAvatarPopupOpen(true);
		setEventListeners();
	};

	const handleEditProfileClick = () => {
		setIsEditProfilePopupOpen(true);
		setEventListeners();
	};

	const handleAddPlaceClick = () => {
		setIsAddPlacePopupOpen(true);
		setEventListeners();
	};

	const handleCardClick = (data) => {
		setSelectedCard(data);
		setEventListeners();
	};

	const setEventListeners = () => {
		document.addEventListener("keydown", handleEscClose);
	};

	const handleEscClose = (evt) => {
		if (evt.key === "Escape") {
			closeAllPopups();
		}
	};

	const closeAllPopups = () => {
		setIsEditProfilePopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setIsEditAvatarPopupOpen(false);
		setIsInfoTooltipOpen(false);
		setSelectedCard(null);
		document.removeEventListener("keydown", handleEscClose);
	};

	const handleUpdateUser = (data) => {
		api
			.setUserData(data)
			.then((res) => {
				setCurrentUser(res);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleUpdateAvatar = (data) => {
		api
			.setUserAvatar(data)
			.then((res) => {
				setCurrentUser(res);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		if (loggedIn) {
			api
				.getCards()
				.then((data) => {
					setCards(data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [loggedIn]);

	const handleClickLike = (card) => {
		const isLiked = card.likes.some((id) => id === currentUser._id);
		api
			.changeLikeCardStatus(card._id, isLiked)
			.then((newCard) => {
				setCards((cards) =>
					cards.map((crd) => (crd._id === card._id ? newCard : crd))
				);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleCardDelete = (card) => {
		api
			.removeCard(card._id)
			.then(() => {
				setCards((cards) => cards.filter((crd) => crd._id !== card._id));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleAddPlaceSubmit = (card) => {
		api
			.createCard(card)
			.then((newCard) => {
				setCards([newCard, ...cards]);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const checkToken = () => {
		if (localStorage.getItem("jwt")) {
			const jwt = localStorage.getItem("jwt");
			if (jwt) {
				mestoAuth
					.getContent(jwt)
					.then((data) => {
						setLoggedIn(true);
						history.push("/");
						setEmail(data.email);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	};

	useEffect(() => {
		checkToken();
	}, []);

	const onRegister = (email, password) => {
		mestoAuth
			.register(email, password)
			.then((data) => {
				if (data) {
					setIsInfoTooltipOpen(true);
					setSuccessfulmessage("Вы успешно зарегистрировались!");
					setIsSuccessfulRegistration(true);
					history.push("/signin");
					setEmail(data.email);
				}
			})
			.catch((err) => {
				setIsSuccessfulRegistration(false);
				setSuccessfulmessage("Что-то пошло не так! Попробуйте ещё раз.");
				setIsInfoTooltipOpen(true);
				console.log(err);
			});
	};

	const onLogin = (email, password) => {
		mestoAuth
			.authorize(email, password)
			.then((data) => {
				if (data) {
					setLoggedIn(true);
					history.push("/");
					setEmail(email);
				}
			})
			.catch((err) => {
				setSuccessfulmessage("Что-то пошло не так! Попробуйте ещё раз.");
				setIsSuccessfulRegistration(false);
				setIsInfoTooltipOpen(true);
				console.log(err);
			});
	};

	const onSignOut = () => {

		setLoggedIn(false);
		localStorage.removeItem("jwt");
		history.push("/signin");
	};

	return (
		<div className="page">
			<CurrentUserContext.Provider value={currentUser}>
				<Header loggedIn={loggedIn} email={email} onSignOut={onSignOut} />

				<Switch>
					<ProtectedRoute
						exact
						path="/"
						loggedIn={loggedIn}
						component={Main}
						onEditAvatar={handleEditAvatarClick}
						onEditProfile={handleEditProfileClick}
						onAddPlace={handleAddPlaceClick}
						onCardClick={handleCardClick}
						cards={cards}
						onCardLike={handleClickLike}
						onCardDelete={handleCardDelete}
					/>

					<Route path="/signin">
						<Login onLogin={onLogin} />
					</Route>

					<Route path="/signup">
						<Register onRegister={onRegister} />
					</Route>

					<Route>
						{loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
					</Route>
				</Switch>

				<Footer />

				<EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					onClose={closeAllPopups}
					onUpdateUser={handleUpdateUser}
				/>

				<AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					onClose={closeAllPopups}
					onAddPlace={handleAddPlaceSubmit}
				/>

				<EditAvatarPopup
					isOpen={isEditAvatarPopupOpen}
					onClose={closeAllPopups}
					onUpdateAvatar={handleUpdateAvatar}
				/>

				{selectedCard && (
					<ImagePopup card={selectedCard} onClose={closeAllPopups} />
				)}

				<InfoTooltip
					isOpen={isInfoTooltipOpen}
					onClose={closeAllPopups}
					status={isSuccessfulRegistration}
					mеssage={successfulmessage}
				/>
			</CurrentUserContext.Provider>
		</div>
	);
};

export default App;
