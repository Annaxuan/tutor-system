import React from 'react';
import './TutorPerformance.css';
import {uid} from "react-uid";

const TutorPerformance = (props) => {
    // props.connections: an array of arrays containing the people that connected and the course [tutor, student, course, date]
    if (props.connections === undefined || props.connections == null) {
        return <></>;
    }

    return <div className={"tutorPerformanceContainer"}>
        {props.connections.map((connection) => {
            return <div className={"connectionContainer"} key={uid(connection)}>
                <div className={'connectionDetail'}>
                    Tutor <span className="bold">{connection[0]} </span>
                    connected with <span className="bold">{connection[1]} </span>.
                </div>
                <div className={'connectionContext'}>
                    {`Course: ${connection[2]}`}
                </div>
            </div>
        })}
    </div>
}

export default TutorPerformance;