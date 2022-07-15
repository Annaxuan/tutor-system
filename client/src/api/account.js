import {useFetch} from "use-http";
import config from "../config";

export function useFetchAllAccount(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/account/allAccount`, {
		headers: {
			"authorization": 'Bearer ' + accessToken,
			...headers
		},
		...args
	})
}

export function useFetchAccount(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/account`, {
		headers: {
			"authorization": 'Bearer ' + accessToken,
			...headers
		},
		...args
	})
}

export function useFetchProfilePicture(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/account/profilePic`, {
		headers: {
			"authorization": 'Bearer ' + accessToken,
			...headers
		},
		...args
	})
}
