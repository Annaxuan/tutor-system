import {useFetch} from "use-http";
import config from "../config";

export function useFetchAccountConnection(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/connection/account`, {
		cachePolicy: 'no-cache',
		headers: {
			"authorization": 'Bearer ' + accessToken,
			headers
		},
		...args
	})
}

export function useFetchCourseConnection(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/connection/course`, {
		cachePolicy: 'no-cache',
		headers: {
			"authorization": 'Bearer ' + accessToken,
			headers
		},
		...args
	})
}

export function useFetchAddConnection(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/connection`, {
		cachePolicy: 'no-cache',
		headers: {
			"authorization": 'Bearer ' + accessToken,
			headers
		},
		...args
	})
}

