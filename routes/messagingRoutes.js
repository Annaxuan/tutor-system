import express from 'express';
const router = express.Router();
import db  from '../models/index.js';
import {sequelizeChecker} from "./helper/sequelizeHelper.js";
import {verifyUser} from "../middleware/verifyUser.js";
import multer from "multer";
import {
    exists,
    get, getMetadata,
    list,
    MessageFileListReference,
    MessageFileReference, put
} from "./helper/fileUploadHelper.js";


router.use(verifyUser)
router.use(sequelizeChecker)
// {
//      content: string
// }
// Adds a new message with this connection id
router.post('/:connectionID',
    async (req, res) => {

    const userId = req.user.id;

    try {
        const connection = req.params.connectionID;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance){
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId){ // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        db.sequelize.transaction(async t => {
            return await db.Message.create({
                content: req.body.content,
                sender: req.user.role === 'tutor',
                dateTime: new Date(),
                ConnectionId: connection
            }, {transaction: t})
        }).then(message => {
            res.send(message)
        }).catch(error => {
            console.log(error)
            res.status(400).send('Bad Request')
        })

    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }

})

// Get all messages associated with the connection id
router.get('/:connectionID',
    async (req, res) => {

    const userId = req.user.id;

    try {
        const connection = req.params.connectionID;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance){
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId){ // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        const messages = await db.sequelize.query(
            `SELECT M.id,
                    M.content,
                    M.sender,
                    M."dateTime",
                    M."ConnectionId"
             FROM "Connections" C JOIN "Messages" M ON C."id" = M."ConnectionId"
             WHERE M."ConnectionId" = ${connection}`,
            {
                // Set this to true if you don't have a model definition for your query.
                raw: true,
                // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                type: db.Sequelize.QueryTypes.SELECT
            }
        )
        res.send(messages)
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }

})

// get a list of FILE NAMES belonging to the given connection
router.get('/files/list/:connectionId', async (req, res) => {
    const userId = req.user.id;

    try {
        const connection = req.params.connectionId;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance) {
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId) { // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        const reference = new MessageFileListReference(connection);
        const maxFilePerIteration = 100;
        const result = []
        let hasNext = true;
        let marker = null;

        while (hasNext) {
            const listResult = await list(reference, maxFilePerIteration, marker);

            result.push(...listResult.Contents);
            hasNext = listResult.HasNextList;
            marker = listResult.NextMarker;
        }

        // get the references to each file, then get the metadata (sender) of the file
        const fileReferences = result.map(MessageFileReference.fromListReferenceResult);
        for (let i = 0; i < fileReferences.length; i++){
            const metadata = await getMetadata(fileReferences[i]);

            fileReferences[i].sender = metadata.Metadata.sender;
            fileReferences[i].date = metadata.LastModified;
        }

        res.send(fileReferences);
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

// get a single file belonging to the given connection if it exists
router.get('/files/:connectionId/:name', async (req, res) => {
    const userId = req.user.id;

    try {
        const connection = req.params.connectionId;
        const fileName = req.params.name;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance) {
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId) { // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        const reference = new MessageFileReference(connection, fileName);
        if (!await exists(reference)){
            res.status(404).send('File not found')
        }else {
            get(reference).createReadStream().pipe(res)
        }
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

// check if a file exists for a given connection
router.get('/files/exists/:connectionId/:name', async (req, res) => {
    const userId = req.user.id;

    try {
        const connection = req.params.connectionId;
        const fileName = req.params.name;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance) {
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId) { // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        const reference = new MessageFileReference(connection, fileName);
        if (!await exists(reference)){
            res.send({exists: false});
        }else {
            res.send({exists: true});
        }
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

// uploads a file to the server for the given connection
router.post('/file/:connectionId', multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    }
}).single("file"), async (req, res) => {
    const userId = req.user.id;
    const file = req.file
    if (!file) {
        res.status(400).send("Invalid file");
        return
    }

    try {
        const connection = req.params.connectionId;

        const connectionInstance = await db.Connection.findByPk(connection)

        if (!connectionInstance) {
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connectionInstance.AccountId && userId !== connectionInstance.TutorId) { // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        const reference = new MessageFileReference(connection, file.originalname)
        await put(reference, file.buffer, {sender: `${req.user.role === 'tutor'}`})

        res.send("Uploaded")
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

export default router;