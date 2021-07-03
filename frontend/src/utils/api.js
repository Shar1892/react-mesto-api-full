class Api {
	constructor(options) {
		this._url = options.url;
		this._userUrl = this._url + "/users/me";
		this._userAvatarUrl = this._url + "/users/me/avatar";
		this._cardUrl = this._url + "/cards";
	}

	_parseResponse(res) {
		if (res.ok) {
			return res.json();
		}

		return Promise.reject(`Код ошибки ${res.status}`);
	}

	getUser() {
		return fetch(this._userUrl, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	setUserData(data) {
		return fetch(this._userUrl, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: data.name,
				about: data.about,
			}),
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	setUserAvatar(url) {
		return fetch(this._userAvatarUrl, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				avatar: url.avatar,
			}),
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	getCards() {
		return fetch(this._cardUrl, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	createCard(data) {
		return fetch(this._cardUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: data.name,
				link: data.link,
			}),
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	removeCard(id) {
		return fetch(`${this._cardUrl}/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				"Content-Type": "application/json",
			},
		})
			.then((res) => this._parseResponse(res))
			.catch((err) => Promise.reject(err));
	}

	changeLikeCardStatus(id, isLiked) {
		if (isLiked) {
			return fetch(`${this._cardUrl}/${id}/likes`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwt')}`,
					"Content-Type": "application/json",
				},
			})
				.then((res) => this._parseResponse(res))
				.catch((err) => Promise.reject(err));
		} else {
			return fetch(`${this._cardUrl}/${id}/likes`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwt')}`,
					"Content-Type": "application/json",
				},
			})
				.then((res) => this._parseResponse(res))
				.catch((err) => Promise.reject(err));
		}
	}
}

export const api = new Api({
	url: "https://api.mestoproject.sgsharov.nomoredomains.club",
});
