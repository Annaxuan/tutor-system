import "./index.css"
import {useEffect, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import {FullWidthContent, GridContainer, Sidebar, SidebarContent} from "../GridContainer";
import TabPanel from "../TabPanel";
import AccountTabPanel from "./AccountTab";
import StudentTabPanel from "./StudentProfileTab";
import TutorTabPanel from "./TutorProfileTab";
import {Tag, TagContainer} from "../TagContainer";

import {useFetchAccount, useFetchProfilePicture} from "../../api/account";
import {useSelector} from "react-redux";
import {selectAuth, selectToken} from "../../redux/slices/authSlice";

function Profile() {

	const isAuth = useSelector(selectAuth);
	const accessToken = useSelector(selectToken);

	const [tab, setTab] = useState(0);
	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	const [user, setUser] = useState(null)
	const [profilePictureSrc, setProfilePictureSrc] = useState("")

	const {get: getUser, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});
	const {get: getProfilePicture, response} = useFetchProfilePicture(accessToken, {}, {cachePolicy: 'no-cache'});

	// fetch user on load
	useEffect(() => {
		if (isAuth) {
			fetchUserInfo()
			fetchProfilePicture()
		}
	}, [])

	const fetchUserInfo = () => {
		getUser().then(setUser)
	}

	const fetchProfilePicture = () => {
		getProfilePicture().then(async () => {
			setProfilePictureSrc(URL.createObjectURL(await response.blob()))
		})
	}

	const setUserData = (data, refreshUserInfo, refreshProfilePicture) => {
		// if data contains the id field, then it's successful,
		if (data && data.id) {
			setUser(data)
		} else {
			if (refreshUserInfo) {
				fetchUserInfo()
			}
			if (refreshProfilePicture) {
				fetchProfilePicture()
			}
		}
	}

	const renderProfileSideBar = () => {
		if (user.role === "student") {
			return <>
				<TagContainer>
					{user.campus && <Tag>{user.campus}</Tag>}
					{user.programOfStudy && <Tag>{user.programOfStudy}</Tag>}
				</TagContainer>
				<p>{user.description}</p>
			</>
		} else if (user.role === "tutor") {
			return <>
				<p>{user.description}</p>
			</>
		}
	}

	const renderProfileTab = () => {
		if (user.role === "student") {
			return <Tab label="Student Profile"/>
		} else if (user.role === "tutor") {
			return <Tab label="Tutor Profile"/>
		}
	}

	const renderProfileTabPanel = () => {
		if (user.role === "student") {
			return <TabPanel value={tab} index={1}>
				<StudentTabPanel user={user} setUser={setUserData}/>
			</TabPanel>
		} else if (user.role === "tutor") {
			return <TabPanel value={tab} index={1}>
				<TutorTabPanel user={user} setUser={setUserData}/>
			</TabPanel>
		}
	}
	if (!isAuth) {
		return <GridContainer>
			<FullWidthContent>
				<h1>Not logged in</h1>
			</FullWidthContent>
		</GridContainer>
	} else if (loading) {
		return <GridContainer>
			<FullWidthContent>
				<h1>Loading ...</h1>
			</FullWidthContent>
		</GridContainer>
	} else if (error) {
		return <GridContainer>
			<FullWidthContent>
				<h1>{error.message}</h1>
			</FullWidthContent>
		</GridContainer>
	} else {
		return (
			<GridContainer>
				<Sidebar>
					{user && <div className={"profileSideBar"}>
						<div className={"icon"}>
							<img src={profilePictureSrc} alt={"profile icon"}/>
						</div>
						<h1 className={"name"}>{user.username}</h1>
						{renderProfileSideBar()}
					</div>}
				</Sidebar>
				<SidebarContent>
					{user && <div>
						<Tabs value={tab} onChange={handleTabChange} className={"profileTabs"}>
							<Tab label="Account" selected/>
							{renderProfileTab()}
						</Tabs>
						<TabPanel value={tab} index={0}>
							<AccountTabPanel user={user} setUser={setUserData}/>
						</TabPanel>
						{renderProfileTabPanel()}
					</div>}
				</SidebarContent>
			</GridContainer>
		)
	}
}

export default Profile;
