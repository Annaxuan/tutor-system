import "./index.css"
import {FullWidthContent, GridContainer, Sidebar, SidebarContent} from "../GridContainer";
import {Tab, Tabs} from "@mui/material"
import {useEffect, useState} from "react";
import {dateEqual, getCurrentTimeZone, toISOWithTimeZoneOffset} from "./dateUtil";
import EventItemList from "./EventItemList";

import {useFetchSchedule} from "../../api/schedule";
import {withParam} from "../../api/ParamUtil";
import ScheduleCalender from "./Calender";
import {useSelector} from "react-redux";
import {selectAuth, selectToken} from "../../redux/slices/authSlice";
import moment from "moment";

const Schedule = () => {

	const isAuth = useSelector(selectAuth);
	const accessToken = useSelector(selectToken);

	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedCourse, setSelectedCourse] = useState(0)
	const [courses, setCourses] = useState([])
	const [schedule, setSchedule] = useState([])
	const [occupiedDates, setOccupiedDates] = useState([])

	const {get, loading, error} = useFetchSchedule(accessToken)

	const isOccupied = (d) => {
		return occupiedDates.some(date => dateEqual(date, d))
	}

	const syncSchedule = async () => {
		if (isAuth) {
			get(withParam({
				courseId: selectedCourse <= 0 ? null : courses[selectedCourse - 1].id,
				date: selectedDate ? toISOWithTimeZoneOffset(selectedDate) : null,
				timezone: getCurrentTimeZone()
			})).then(({schedule, courses, occupiedDates}) => {
				schedule.forEach(event => event.date = moment(event.date).toDate())
				setSchedule(schedule)
				setCourses(courses)
				setOccupiedDates(occupiedDates.map(date => moment(date).toDate()))
			}).catch(error => console.error(error))
		}
	}

	useEffect(() => {
		syncSchedule().then()
	}, [selectedDate, selectedCourse])

	if (!isAuth) {
		return <GridContainer>
			<FullWidthContent>
				<h1>Not logged in</h1>
			</FullWidthContent>
		</GridContainer>
	} else {
		return (
			<GridContainer>
				<Sidebar>
					<div className={"calenderContainer"}>
						<ScheduleCalender selectedDate={selectedDate} setSelectedDate={setSelectedDate}
						                  isOccupied={isOccupied}/>
					</div>
				</Sidebar>
				<SidebarContent>
					<Tabs value={selectedCourse} onChange={(event, value) => setSelectedCourse(value)}
					      className={"courseTabs"}>
						<Tab label="All" selected/>
						{courses.map((course, index) => <Tab label={course.name} key={index + 1}
						                                     className={course.hasSchedule ? "courseTab hasSchedule" : "courseTab"}/>)}
					</Tabs>
					{error ? error.message :
						<EventItemList loading={loading} schedule={schedule} withDivider={selectedDate === null}/>}
				</SidebarContent>
			</GridContainer>
		)
	}
}

export default Schedule;