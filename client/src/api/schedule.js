import {useFetch} from "use-http";
import config from "../config";

export function useFetchSchedule(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/schedule`, {
		cachePolicy: 'no-cache',
		headers: {
			"authorization": 'Bearer ' + accessToken,
			headers
		},
		...args
	})
}
