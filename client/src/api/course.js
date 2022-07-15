import {useFetch} from "use-http";
import config from "../config";

export function useFetchCourse(accessToken, headers, args) {
	return useFetch(`${config.api_host}/api/course`, {
		cachePolicy: 'no-cache',
		headers: {
			"authorization": 'Bearer ' + accessToken,
			headers
		},
		...args
	})
}
