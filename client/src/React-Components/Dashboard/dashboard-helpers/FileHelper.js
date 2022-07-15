import config from "../../../config";

const parseFileToMessage = (fileMetadataList, selfUsername, targetUsername, targetRole) => {

    let tutor, nonTutor;
    if (targetRole === "tutor"){
        tutor = targetUsername;
        nonTutor = selfUsername;
    }else {
        tutor = selfUsername;
        nonTutor = targetUsername;
    }
    fileMetadataList = fileMetadataList.sort((a, b) => a.date > b.date);

    return fileMetadataList.map(fileMetadata => [fileMetadata.sender === 'true' ? tutor : nonTutor,
        fileMetadata.key.split('/')[1]])
}

const fileSearcher = (connectionId, selfUsername, targetUsername, targetRole, accessToken, setFiles) => {
    fetch(`${config.api_host}/api/message/files/list/${connectionId}`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    }).then(res => {
        if (res.status !== 200) {
            alert(`Error: ${res.status}, Cannot load profile picture`)
            throw new Error(`request failed, ${res.status}`);
        }else {
            return res.json()
        }
    }).then(async res => {
        setFiles(parseFileToMessage(res, selfUsername, targetUsername, targetRole))
    }).catch(error => {
        console.log(error);
    });
}

const onSelectFileHandler = (connectionId, accessToken, event) => {

    fetch(`${config.api_host}/api/message/files/${connectionId}/${event.target.firstChild.nodeValue}`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        },
    }).then(res => {
        if (res.status !== 200) {
            alert(`Error: ${res.status}, Cannot load file`)
            throw new Error(`request failed, ${res.status}`);
        }else {
            return res.blob()
        }
    }).then(blob => {

        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.setAttribute(
            'download',
            event.target.firstChild.nodeValue,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }).catch(error => {
        console.log(error);
    });
}

export {
    fileSearcher,
    onSelectFileHandler
}