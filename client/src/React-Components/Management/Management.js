import {useState} from 'react';
import {FullWidthContent, GridContainer} from "../GridContainer";
import ManagementAccountTab from "./ManagementTab/ManagementAccountTab";
import {Tab, Tabs} from "@mui/material";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice";
import {selectAuth} from "../../redux/slices/authSlice";
import ManagementCourseTab from "./ManagementTab/ManagementCourseTab";

const Management = () => {
	// const [loading, setLoading] = useState(false);
	// const [protectedData, setProtectedData] = useState(null);

	const user = useSelector(selectUser);
	const isAuth = useSelector(selectAuth);

	//
	// const api_url = 'http://localhost:5002/courses/'
	//
	// const protectedInformation = async () => {
	// 	try {
	// 		const {data} = await fetchProtectedInfo();
	//
	// 		setProtectedData(data.info);
	//
	// 		setLoading(false);
	// 	} catch (error) {
	// 		console.log(error)
	// 		// logout();
	// 	}
	// };
	//
	// useEffect(() => {
	// 	protectedInformation().then();
	// }, []);

	// loading ? (
	// 	<>
	// 		<h1>Loading...</h1>
	// 	</>
	// ) :

	// {/*<h2>protectedData from API: {protectedData}</h2>*/}
	// {/*<h1>Data about the currently logged-in user: </h1>*/}
	// {/*{user && (*/}
	// {/*	<>*/}
	// {/*		<p>username: {user.username}</p>*/}
	// {/*		<p>email: {user.email}</p>*/}
	// {/*		<p>role: {user.role}</p>*/}
	// {/*	</>*/}
	// {/*)}*/}


	const [tab, setTab] = useState(0);
	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	const renderManagement = () => {
		if (isAuth && user && user.role === "admin") {
			return <>
				<h1>Management Console</h1>
				<Tabs value={tab} onChange={handleTabChange} className={"profileTabs"}>
					<Tab label="Account Management" selected/>
					<Tab label="Course Management"/>
				</Tabs>
				<ManagementAccountTab value={tab} index={0}/>
				<ManagementCourseTab value={tab} index={1}/>
			</>
		} else {
			return <h1>Unauthorized!</h1>
		}
	}

	return (
		<GridContainer>
			<FullWidthContent>
				{renderManagement()}
			</FullWidthContent>
		</GridContainer>
	);
};

export default Management;
