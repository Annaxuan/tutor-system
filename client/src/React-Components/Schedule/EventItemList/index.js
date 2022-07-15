import "./index.css"
import {useState} from "react";
import EventItem from "../EventItem";
import {dateCompare, dateEqual} from "../dateUtil";

const EventItemList = ({loading, schedule, withDivider}) => {
	const [expanded, setExpanded] = useState(-1);
	const handleAccordionChange = (id) => (event, isExpanded) => {
		setExpanded(isExpanded ? id : -1);
	};

	const renderSchedule = () => {
		const sortedSchedule = schedule.sort((s1, s2) => dateCompare(s1.date, s2.date))
		const today = new Date();
		if(loading) {
			return <p className={"eventListPlaceholder"}>Loading ...</p>
		} else {
			return <div className={"eventList"}>
				{sortedSchedule.length === 0 && ! withDivider && <p className={"eventListPlaceholder"}>No Events</p>}
				{renderFutureSchedules(sortedSchedule.filter(s => s.date >= today || dateEqual(s.date, today)))}
				{renderPastSchedule(sortedSchedule.filter(s => s.date < today && ! dateEqual(s.date, today)))}
			</div>
		}
	}

	const renderFutureSchedules = (futureSchedule) => {
		return <>
			{futureSchedule.length === 0 && withDivider && <p className={"eventListPlaceholder"}>No Future Events</p>}
			{futureSchedule.map(event => <EventItem
				key={event.id}
				event={event}
				expanded={expanded === event.id} onChange={handleAccordionChange(event.id)}
				disabledEvent={false}
			/>)}
		</>
	}

	const renderPastSchedule = (pastSchedule) => {
		return <>
			{pastSchedule.length !== 0 && withDivider && <h6 className={"divider"}><span>Past Events</span></h6>}
			{pastSchedule.reverse().map(event => <EventItem
					key={event.id}
					event={event}
					expanded={expanded === event.id} onChange={handleAccordionChange(event.id)}
					disabledEvent={true}
				/>)}
		</>
	}

	return (
		<div>
			{renderSchedule()}
		</div>
	)
}

export default EventItemList;