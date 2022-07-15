/**
 * Construct a param query.
 *
 * withParam({id: 1, prop1: null, prop2: 2}) === '?id=1&prop2=2'
 *
 * @param param
 * @returns {string}
 */
export function withParam(param) {
	const filteredParam = {}
	for (const [key, value] of Object.entries(param)) {
		if(value) {
			filteredParam[key] = value
		}
	}
	return "?" + new URLSearchParams(filteredParam)
}
