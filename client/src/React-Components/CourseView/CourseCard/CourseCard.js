import React, { useState , useEffect} from "react";
import './CourseCard.css';
import config from "../../../config";


const CourseCard = (props) => {

	const [pic, setPic] = useState("");

	useEffect(() => {
		// fetchProfilePicture()
		fetch(`${config.api_host}/api/course/coursePic/${props.courseID}`, {
		}).then(res => {
			if (res.status !== 200) {
				alert(`Error: ${res.status}, Cannot load course picture`)
				throw new Error(`request failed, ${res.status}`);
			}else {
				return res
			}
		})
			.then(async res => {
				setPic(URL.createObjectURL(await res.blob()))
			})
			.catch(error => {
				console.log(error);
			});
}, [])


	return (
		<div className="card">
			<div className="cardNum">{props.courseNum}</div>
			<div className="cardName">{props.courseName}</div>
			<img src={pic} alt = "new" className="cardPic" />
		</div>
	  );
};

export default CourseCard;