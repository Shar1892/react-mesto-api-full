export const BASE_URL = "https://auth.nomoreparties.co";

export const register = (email, password) => {
	return fetch(`${BASE_URL}/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ password: password, email: email }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.catch((err) => Promise.reject(err));
};

export const authorize = (email, password) => {
	return fetch(`${BASE_URL}/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ password: password, email: email }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.then((data) => {
			console.log(data);
			if (data.token) {
				localStorage.setItem("jwt", data.token);
				return data;
			} else {
				return;
			}
		})
		.catch((err) => Promise.reject(err));
};

export const getContent = (token) => {
	return fetch(`${BASE_URL}/users/me`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.catch((err) => Promise.reject(err));
};
