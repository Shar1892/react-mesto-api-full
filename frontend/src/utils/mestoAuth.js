export const BASE_URL = "https://api.mestoproject.sgsharov.nomoredomains.club";

export const register = (email, password) => {

	return fetch(`${BASE_URL}/signup`, {
		mode: 'cors',
		method: "POST",
		headers: {
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
		mode: 'cors',
		method: "POST",
		headers: {
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
		mode: 'cors',
		method: "GET",
		headers: {
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
