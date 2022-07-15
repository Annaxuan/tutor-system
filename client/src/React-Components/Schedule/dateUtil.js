import moment from "moment-timezone";

const dateEqual = (d1, d2) => d1 !== null && d2 !== null && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
const dateCompare = (d1, d2) => d1.getTime() < d2.getTime() ? -1 : (d1.getTime() > d2.getTime() ? 1 : 0)
const getShortLocalDateString = (d) => d.toLocaleDateString("en-ca", {year: 'numeric', month: 'long'})
const getDetailedLocalDateTimeString = (d) => d.toLocaleDateString("en-ca", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"})

const getDateWithoutTime = (date) => {
	// https://stackoverflow.com/a/43528844
	const dateWithoutTime = date ? date : new Date()
	dateWithoutTime.setHours(0, 0, 0, 0);
	return dateWithoutTime;
}

const toISOWithTimeZoneOffset = (date) => {
	return moment(date).toISOString(true)
}

const getCurrentTimeZone = () => {
	return moment.tz.guess()
}

export {
	dateEqual,
	dateCompare,
	getShortLocalDateString,
	getDetailedLocalDateTimeString,
	getDateWithoutTime,
	toISOWithTimeZoneOffset,
	getCurrentTimeZone
}
