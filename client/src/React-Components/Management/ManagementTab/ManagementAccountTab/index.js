import "./index.css"
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../redux/slices/authSlice";
import {useFetchAccount, useFetchAllAccount} from "../../../../api/account";
import {AccountManagementAccordion} from "../../ManagementAccordion/AccountManagementAccordion";
import TagFilterRow from "../TagFilterRow";
import {withParam} from "../../../../api/ParamUtil";
import TabPanel from "../../../TabPanel";
import {Button, TextField} from "@mui/material";

function ManagementAccountTab({...others}) {

	const accessToken = useSelector(selectToken);

	const [expanded, setExpanded] = useState(-1);
	const handleAccordionChange = (id) => (event, isExpanded) => {
		setExpanded(isExpanded ? id : false);
	};

	const [accounts, setAccounts] = useState([])

	const [roleFilter, setRoleFilter] = useState("");
	const roleFilterOption = [
		{key: "All", value: ""},
		{key: "Student", value: "student"},
		{key: "Tutor", value: "tutor"},
		{key: "Admin", value: "admin"},
	]

	const [campusFilter, setCampusFilter] = useState("");
	const campusFilterOption = [
		{key: "All", value: ""},
		{key: "St. George", value: "St. George"},
		{key: "Scarborough", value: "Scarborough"},
		{key: "Mississauga", value: "Mississauga"},
	]

	const [queryFilter, setQueryFilter] = useState("");

	const {get, loading, error, cache} = useFetchAllAccount(accessToken)

	useEffect(() => {
		updateAccountResult()
	}, [roleFilter, campusFilter])

	const updateAccountResult = (forceRefresh) => {
		if(forceRefresh) {
			cache.clear()
		}
		get(withParam({role: roleFilter, campus: campusFilter, query: queryFilter})).then(setAccounts)
	}

	const enterKeyDownSubmit = (e) => {
		if(e.keyCode === 13) {
			updateAccountResult()
		}
	}

	const emptyTextClearsFilter = () => {
		if(queryFilter === "") {
			updateAccountResult()
		}
	}

	useEffect(emptyTextClearsFilter, [queryFilter])

	const renderAllAccounts = () => {
		if(error) {
			return <h2>{error.message}</h2>
		} else if (loading) {
			return <h2>Loading...</h2>
		} else if (accounts.length === 0) {
			return <h2>Empty Result</h2>
		} else {
			return <>
				{accounts.map(account => <AccountManagementAccordion
					account={account} key={account.id} updateAccountResult={updateAccountResult}
					expanded={expanded === account.id} onChange={handleAccordionChange(account.id)}
				/>)}
			</>
		}
	}

	return (
		<TabPanel className={"accountManagementTab"} {...others}>
			<div className={"searchContainer"}>
				<TextField label={"Search for ID / Username / Email / Program of Study / Description"} onKeyDown={enterKeyDownSubmit} fullWidth className={"searchField"} value={queryFilter} onChange={event => setQueryFilter(event.target.value)}/>
				<Button variant={"contained"} onClick={updateAccountResult}>Search</Button>
			</div>
			<div className={"filterContainer"}>
				<TagFilterRow name={"Role:"} selected={roleFilter} setSelected={setRoleFilter} optionMap={roleFilterOption}/>
				<TagFilterRow name={"Campus:"} selected={campusFilter} setSelected={setCampusFilter} optionMap={campusFilterOption}/>
			</div>
			<div>
				{renderAllAccounts()}
			</div>
		</TabPanel>
	);
}

export default ManagementAccountTab;