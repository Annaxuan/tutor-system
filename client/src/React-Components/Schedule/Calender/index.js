import './index.css';
import {Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useState} from "react";
import {dateEqual, getDateWithoutTime, getShortLocalDateString} from "../dateUtil";

const getToday = () => getDateWithoutTime()

const ScheduleCalender = ({selectedDate, setSelectedDate, isOccupied}) => {

	const [date, setDate] = useState(selectedDate ? setSelectedDate : getToday())
	const [today, setToday] = useState(getToday())

	const changeSelectedDate = (d) => {
		setSelectedDate(d)
	}

	const goToToday = () => {
		setToday(getToday())
		setSelectedDate(today)  // set selected value to today
		setDate(today)  // navigate to today
	}

	const showAll = () => {
		setSelectedDate(null)
	}

	const setMonth = (offset) => {
		setDate(new Date(date.getFullYear(), date.getMonth() + offset, date.getDate()))
	}

	const getWeeks = () => {
		const weeks = []
		let d = new Date(date)
		d.setDate(1) // set to month start
		d.setDate(d.getDate() - d.getDay()) // set to week start
		do {
			weeks.push(new Date(d))
			d.setDate(d.getDate() + 7) // move to next week
		} while (d.getMonth() === date.getMonth())
		return weeks
	}

	return (
		<div>
			<div className={"calenderHeader"}>
				<div className={"calenderHeaderControl"}>
					<Button variant="outlined" onClick={() => setMonth(-1)} fullWidth>
						<ArrowBackIcon/>
					</Button>
				</div>
				<h2>{getShortLocalDateString(date)}</h2>
				<div className={"calenderHeaderControl"}>
					<Button variant="outlined" onClick={() => setMonth(+1)} fullWidth>
						<ArrowForwardIcon/>
					</Button>
				</div>
			</div>
			<table>
				<tbody>
				<tr className={"header"}>
					<th>S</th>
					<th>M</th>
					<th>T</th>
					<th>W</th>
					<th>T</th>
					<th>F</th>
					<th>S</th>
				</tr>
				{getWeeks().map((d, index) => (
					<tr key={`row ${index}`}>
						{[0, 1, 2, 3, 4, 5, 6].map(wd => {
							const thisDate = new Date(d)
							thisDate.setDate(thisDate.getDate() + wd)
							let className = ""
							className += thisDate.getMonth() !== date.getMonth() ? " hidden" : ""
							className += dateEqual(thisDate, today) ? " today" : ""
							className += dateEqual(thisDate, selectedDate) ? " selected" : ""
							className += isOccupied(thisDate) ? " occupied" : ""
							return (
								<td className={className}
								    onClick={() => changeSelectedDate(thisDate)}
								    key={`cell ${index + wd}`}>
									{thisDate.getDate()}
								</td>
							)
						})}
					</tr>
				))}
				</tbody>
			</table>
			<div className={"calenderFooter"}>
				<div className={"calenderFooterControl"}>
					<Button variant="contained" onClick={() => goToToday()} fullWidth>
						Go to Today
					</Button>
				</div>
				<div className={"calenderFooterControl"}>
					<Button variant="contained" onClick={() => showAll()} disabled={selectedDate === null} fullWidth>
						Clear Date Filter
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ScheduleCalender;
