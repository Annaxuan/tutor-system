import React, {useEffect, useState} from 'react'
import {Navigate, useParams} from "react-router-dom";
import SideOptions from "./dashboard-side-option-list/SideOption";
import UserInfo from "./dashboard-user-info/UserInfo";
import ChatBox from "./dashboard-chat/Chat";
import {GridContainer, Sidebar, SidebarContent} from "../GridContainer";
import './Dashboard.css';
import TutorPerformance from "./dashboard-tutor-performance/TutorPerformance";
import config from "../../config";
import {useSelector} from "react-redux";
import {useFetch} from "use-http";
import {selectUser} from "../../redux/slices/userSlice";
import {selectAuth, selectToken} from "../../redux/slices/authSlice";
import {fileSearcher, onSelectFileHandler} from "./dashboard-helpers/FileHelper";

const Dashboard = () => {
    const [choice, setChoice] = useState(0);
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectAuth);
    const accessToken = useSelector(selectToken);

    const params = useParams()

    let initialTarget = { // Default values
        username: null,
        type: null,
        targetCourse: null,
        status: false,
        description: null, // Can be null or empty if the user is an admin
        tutorAccountCourseID: -1
    }

    let initialAccount = { // default values too
        username: null,
        type: null,
        courses: [],
        admins: [],
        courseNodeID: 0,
        userNodeID: 0,
        adminNodeID: 0,
        connectionData: []
    }

    const [target, setTarget] = useState(initialTarget);
    const [account, setAccount] = useState(initialAccount);
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [accountProfilePic, setAccountProfilePic] = useState("");
    const [targetProfilePic, setTargetProfilePic] = useState("");

    const {get, loading, error} = useFetch(`${config.api_host}/api/connection/account/${user == null ? "" : user.id}`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    })


    const accountFinder = async () => {
        if (!isAuth || user === null){
            return;
        }

        let tutorAccountCourse = params.tutorAccountCourse;

        if (tutorAccountCourse === undefined) {
            tutorAccountCourse = null;
        }else {
            tutorAccountCourse = parseInt(tutorAccountCourse)
        }
        const account = user;

        const courses = [userTypeRelation(account.role)];
        let admins = [];

        const connections = await get();
        let tutorAccountCourses = connections;

        let count = 1;
        let adminNodeID = null;
        let courseNodeID = null;
        let userNodeID = null;

        if (account.role === "tutor"){
            admins.push("Chat with an admin about a course:")
            // Need to filter out the tutor-student and admin-tutor connections
            const tutorAdmins = tutorAccountCourses.tutorAdmin;
            tutorAccountCourses = tutorAccountCourses.tutorStudent;

            // We only need course numbers for admin-tutor connections
            admins = admins.concat(tutorAdmins.map((tac) => {
                if (tutorAccountCourse === tac.id){
                    adminNodeID = count;
                }
                count++;
                return parseStatus({status: tac.status, name: tac.courseNum},
                    "(Applying) ");
            }));
        }else {

            let tableName = 'tutorStudent';
            if (account.role === 'admin'){
                tableName = 'tutorAdmin';
            }
            tutorAccountCourses = tutorAccountCourses[tableName];
        }

        // "reverse" the indexing or flattening action in the sidebar options
        count = 1;


        const allCourses = [];
        tutorAccountCourses.forEach(tac => {
            if (!allCourses.includes(tac.CourseId)){
                allCourses.push(tac.CourseId);
            }
        })

        // For every course, we find the connections this user is involved with in that specific course
        for (let i = 0; i < allCourses.length; i++) {
            const course = tutorAccountCourses.filter((tac) => {
                if (tac.id === tutorAccountCourse && tac.CourseId === allCourses[i]){
                    courseNodeID = count;
                }
                return tac.CourseId === allCourses[i];
            });

            if (course.length > 0) {
                count++;
                courses.push([course[0].courseNum].concat(course.map((tac) => {
                    if (tutorAccountCourse === tac.id){
                        userNodeID = count;
                    }
                    let falseWord = "(Non-registered) ";

                    let name = tac.TargetUsername;

                    if (account.role === "admin"){
                        falseWord = "(Applying) "
                    }
                    count++;

                    return parseStatus({status: tac.status, name}, falseWord);
                })));
            }
        }

        setAccount({
            username: account.username,
            type: account.role,
            courses: courses,
            admins: admins,
            courseNodeID: courseNodeID,
            userNodeID: userNodeID,
            adminNodeID: adminNodeID,
            connectionData: connections
        })
    }

    useEffect(() => {
        accountFinder().then()
    }, [get, isAuth])


    if (!isAuth || user === null){
        return <Navigate to={'/login'}/>;
    }else {

        const setTargetUser = (target, targetCourse, status) => {
            const temp = chooseTarget(account, target, targetCourse, status, setTarget, setMessages, setPerformance, accessToken, setTargetProfilePic, setAccountProfilePic, null, setFiles);
            setTarget(temp);
        }

        const handleOptionSelected = (event, option) => {
            const selected = findSelectedItem(parseInt(option), account.courses);

            if (selected[0] != null){
                const courseItem = parseStatusAndItem(selected[0]);

                setTargetUser(courseItem[1], selected[1], courseItem[0]);
            }
        }

        const handleOptionSelectedForTutorAdmin = (event, option) => {
            const selected = findSelectedItem(parseInt(option), account.admins);

            if (selected[0] != null){
                const courseItem = parseStatusAndItem(selected[0]);

                setTargetUser("admin", courseItem[1], courseItem[0]);
            }
        }

        // Changes the status of the current connection to true
        const onChangeStatus = () => {
            target.status = true;
            setTarget({...target});
            accountFinder().then();
        }

        return (
            <div className={"contentBox"}>
                {loading ? "Loading..." :
                <GridContainer>
                    <Sidebar>
                        <SideOptions
                            options={account.courses}
                            userNodeID={account.userNodeID === null ? null : `${account.userNodeID}`}
                            courseNodeID={account.courseNodeID === null ? null : `${account.courseNodeID}`}
                            handler={handleOptionSelected}
                        />
                        <br/>
                        {(account.type === 'tutor' ?
                            <div>
                                <SideOptions
                                    options={account.admins}
                                    userNodeID={account.adminNodeID === null ? null : `${account.adminNodeID}`}
                                    courseNodeID={null}
                                    handler={handleOptionSelectedForTutorAdmin}
                                />
                            </div>
                             :
                            <></>)
                        }
                    </Sidebar>
                    <SidebarContent>

                            <div className={"adminChoiceContainer"}>
                                <div
                                    className={`adminChoiceButton 
                                    ${(choice === 0) ? "selected": ""}`}
                                    onClick={(_) => setChoice(0)}
                                >
                                    Chat
                                </div>
                                <div
                                    className={`adminChoiceButton 
                                    ${(choice === 1) ? "selected": ""}`}
                                    onClick={(_) => setChoice(1)}
                                >
                                    File
                                </div>
                                {(account.type === "admin") ?
                                <div
                                    className={`adminChoiceButton 
                                    ${(choice === 2) ? "selected": ""}`}
                                    onClick={(_) => setChoice(2)}
                                >
                                    Performance
                                </div> :
                                <></>}
                            </div>

                        <UserInfo userType={account.type}
                                  targetType={target.type}
                                  username={target.username}
                                  profilePicture={targetProfilePic}
                                  description={target.description}
                                  course={target.targetCourse}
                                  status={target.status}
                                  campus={target.campus}
                                  program={target.program}
                                  onChangeStatus={onChangeStatus}
                                  tutorAccountCourseID={target.tutorAccountCourseID}
                        />
                        {(choice === 0) ?
                            <ChatBox self={account.username}
                                     selfRole={account.type}
                                     target={target.username}
                                     messages={messages}
                                     setMessages={setMessages}
                                     selfProfile={accountProfilePic}
                                     targetProfile={targetProfilePic}
                                     tutorAccountCourseID={target.tutorAccountCourseID}
                                     fileView={false}
                                     files={files}
                                     setFiles={setFiles}
                            /> :
                            (choice === 1) ?
                                <ChatBox self={account.username}
                                         selfRole={account.type}
                                         target={target.username}
                                         messages={files}
                                         setMessages={setFiles}
                                         selfProfile={accountProfilePic}
                                         targetProfile={targetProfilePic}
                                         tutorAccountCourseID={target.tutorAccountCourseID}
                                         fileView={true}
                                         files={files}
                                         setFiles={setFiles}
                                         onClick={(event) =>
                                             onSelectFileHandler(target.tutorAccountCourseID, accessToken, event)}
                                />:
                                <TutorPerformance connections={performance}/>
                        }

                    </SidebarContent>
                </GridContainer>
                }
                {error ? error : <></>}
            </div>

        );
    }
}


const parseStatus = (item, falseDescription) => {
    let output = "";

    if (!item["status"]) {
        output += falseDescription;
    }

    output += item["name"];

    return output;
}

const userTypeRelation = (type) => {
    if (type === "student"){
        return "My tutors:";
    }else if (type === "tutor"){
        return "My students:";
    }else {
        return "Manage tutor applications:";
    }
}


// Returns a list of message objects of the required tutor account course id
const messageSearcher = (tutorAccountCourseID, selfUsername, targetUsername, targetRole, setMessages, accessToken) => {
    let tutor, nonTutor;
    if (targetRole === "tutor"){
        tutor = targetUsername;
        nonTutor = selfUsername;
    }else {
        tutor = selfUsername;
        nonTutor = targetUsername;
    }

    let messages = [];

    // Making a request to get the messages from server
    const url = `${config.api_host}/api/message/${tutorAccountCourseID}`;

    // Send the request with fetch()
    fetch(url, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    })
        .then(res => {
            if (res.status !== 200) {
                alert(`Error: ${res.status}, Cannot load message`)
                return messages;
            }else {
                return res.json()

            }
        })
        .then(json => {
            messages = json.map(message =>
                [message.sender ? tutor : nonTutor, message.content]
            )
            setMessages(messages);
        })
        .catch(error => {
            console.log(error);
            return messages;
        });

}

// Returns a user in a specific format, sample:
// let targetUser = {
//     username: state.target,
//     description: "Third year student", // Can be null or empty if the user is an admin
//     messagingHistory: [
//         [account.username, "Hi"],
//         [state.target, "Hello"],
//         [state.target, "How can I help"],
//         [account.username, "I got 0 in course1's midterm."],
//         [account.username, "Hi"],
//         [state.target, "Hello"],
//         [state.target, "How can I help"],
//         [account.username, "I got 0 in course1's midterm."]
//     ],
//     tutorPerformance: [
//         ["tutor1", "student1", "course1", new Date()],
//         ["tutor1", "student1", "course1", new Date()],
//         ["tutor1", "student1", "course1", new Date()],
//         ["tutor1", "student1", "course1", new Date()],
//         ["tutor1", "student1", "course1", new Date()],
//     ]
// };
const chooseTarget = (account, targetUsername, course, status,
                      setTarget, setMessages, setPerformance, accessToken,
                      setTargetProfilePic, setAccountProfilePic, connectionId = null, setFiles) => {
    let targetConnection;
    let targetRole;

    // Finding the target connection from the data fetched from server
    if (account.type === 'tutor'){
        if (connectionId !== null){
            targetConnection = account.connectionData.tutorStudent.find(connection => {
                return connection.id === tutorAccountCourseID;
            });
        }else {
            targetConnection = account.connectionData.tutorStudent.find(connection => {
                return connection.TargetUsername === targetUsername && connection.courseNum === course;
            });
        }
        targetRole = "student";

        if (targetConnection === undefined){
            if (connectionId !== null){
                targetConnection = account.connectionData.tutorAdmin.find(connection => {
                    return connection.id === tutorAccountCourseID;
                });
            }else {
                targetConnection = account.connectionData.tutorAdmin.find(connection => {
                    return connection.TargetUsername === targetUsername && connection.courseNum === course;
                });
            }
            targetRole = "admin";
        }
    }else {
        let tableName = 'tutorStudent';
        if (account.type === 'admin'){
            tableName = 'tutorAdmin';
        }

        if (connectionId !== null){
            targetConnection = account.connectionData[tableName].find(connection => {
                return connection.id === tutorAccountCourseID;
            });
        }else {
            targetConnection = account.connectionData[tableName].find(connection => {
                return connection.TargetUsername === targetUsername && connection.courseNum === course;
            });
        }
        targetRole = "tutor";
    }

    let tutorAccountCourseID = targetConnection.id;

    // Find two profile pics
    fetch(`${config.api_host}/api/account/profilePic/${targetConnection.TargetId}`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    }).then(res => {
        if (res.status !== 200) {
            alert(`Error: ${res.status}, Cannot load profile picture`)
            throw new Error(`request failed, ${res.status}`);
        }else {
            return res
        }
    })
        .then(async res => {
            setTargetProfilePic(URL.createObjectURL(await res.blob()))
        })
        .catch(error => {
            console.log(error);
        });

    fetch(`${config.api_host}/api/account/profilePic`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    }).then(res => {
        if (res.status !== 200) {
            alert(`Error: ${res.status}, Cannot load profile picture`)
            throw new Error(`request failed, ${res.status}`);
        }else {
            return res
        }
    })
        .then(async res => {
            setAccountProfilePic(URL.createObjectURL(await res.blob()))
        })
        .catch(error => {
            console.log(error);
        });

    messageSearcher(tutorAccountCourseID, account.username, targetConnection.TargetUsername, targetRole, setMessages, accessToken);
    fileSearcher(tutorAccountCourseID, account.username, targetConnection.TargetUsername, targetRole, accessToken, setFiles)

    // clear all previous intervals
    let id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id);
    }

    // Refresh every 3 seconds to provide "real time" messaging
    window.setInterval(() => {
        messageSearcher(tutorAccountCourseID, account.username, targetConnection.TargetUsername, targetRole, setMessages, accessToken);
        fileSearcher(tutorAccountCourseID, account.username, targetConnection.TargetUsername, targetRole, accessToken, setFiles)
    }, 3000)

    if (account.type === 'admin'){
        // Making a request to get the tutor connections from server and compute performance
        const url = `${config.api_host}/api/connection/account/${targetConnection.TargetId}`;

        // Send the request with fetch()
        fetch(url, {
            cachePolicy: 'no-cache',
            headers: {
                "authorization": 'Bearer ' + accessToken
            },
        })
            .then(res => {
                if (res.status !== 200) {
                    alert(`Error: ${res.status}, Cannot load message`)
                    throw new Error(`request failed, ${res.status}`);
                }else {
                    return res.json()
                }
            })
            .then(json => {
                const performance = json.tutorStudent.map(connection =>
                    [targetConnection.TargetUsername, connection.TargetUsername, connection.courseNum]
                )
                setPerformance(performance);
            })
            .catch(error => {
                console.log(error);
            });
    }else {
        setPerformance(null)
    }


    return {
        username: targetConnection.TargetUsername,
        type: targetRole,
        targetCourse: targetConnection.courseNum,
        status: targetConnection.status,
        description: targetConnection.TargetDescription,
        campus: targetConnection.TargetCampus,
        program: targetConnection.TargetProgramOfStudy,
        tutorAccountCourseID: targetConnection.id
    }
}

// Extract the chosen item based on its index in the nested list obj
// Return the pair [p, q] where p is the chosen item, and q is the most specific sub list p is in
const findSelectedItem = (index, obj) => {
    let count = 0;
    let result = null;
    let resultCourse = null;
    const finder = (index, obj) => {
        if (Array.isArray(obj)){
            // Here index points to an array, or actually the first element of an array, we should ignore this
            if (count === index){
                result = null;
                return true;
            }else {
                count++;
                resultCourse = obj[0];
                for (let i = 1; i < obj.length; i++){
                    if (finder(index, obj[i])){
                        return true;
                    }
                }
                return false;
            }
        }else {
            if (count === index){
                result = obj;
                return true;
            }else {
                count++;
                return false;
            }
        }
    }
    finder(index, obj);
    return [result, resultCourse];
}

// Parse a string of form "(status) name" or "name".
// if it is the former form, return [false, name], otherwise return [true, name]
const parseStatusAndItem = (str) => {
    if (str.charAt(0) === '('){
        return [false, str.slice(str.indexOf(' ') + 1)];
    }else {
        return [true, str];
    }
}

export default Dashboard;