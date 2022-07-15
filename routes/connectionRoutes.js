import express from 'express';
const router = express.Router();
import db  from '../models/index.js';
import {sequelizeChecker} from "./helper/sequelizeHelper.js";
import {verifyUser} from "../middleware/verifyUser.js";


router.use(sequelizeChecker)

// Get all connections associated with the course
// Since there are mainly two types of connections: user-tutor and tutor-admin
// This request gives back
// {
//      userTutor: [connections...],
//      tutorAdmin: [connections...]
// }
// Format:
// {
//      "userTutor": [
//         {
//             "id",
//             "status",
//             "TutorId",
//             "TutorUsername",
//             "AccountId",
//             "AccountUsername",
//             "CourseId",
//             "courseNum"
//         }...
//     ],
//     "tutorAdmin": [connections... (see above)]
// }
router.get('/course/:courseId',
    async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const query = role => `SELECT C.id,
                    C.status,
                    C."TutorId",
                    T.username AS "TutorUsername",
                    T.description AS "TutorInfo",
                    C."AccountId",
                    A.username AS "AccountUsername",
                    C."CourseId",
                    Co."courseNum",
                    Co."campus"
             FROM "Connections" C JOIN "Accounts" A ON C."AccountId" = A."id"
                                  JOIN "Tutors" T ON C."TutorId" = T."id"
                                  JOIN "Courses" Co ON C."CourseId" = Co."id"
             WHERE C."CourseId" = ${courseId} AND A.role = '${role}' AND C.status`;


        const userTutor = await db.sequelize.query(query('student'),
            {
                // Set this to true if you don't have a model definition for your query.
                raw: true,
                // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                type: db.Sequelize.QueryTypes.SELECT
            }
        )
        const tutorAdmin = await db.sequelize.query(query('admin'),
            {
                // Set this to true if you don't have a model definition for your query.
                raw: true,
                // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                type: db.Sequelize.QueryTypes.SELECT
            }
        )
        res.send({ userTutor, tutorAdmin })
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
});


// Get all connections of the account
// This request gives back
// {
//      userTutor: [connections...],
//      tutorAdmin: [connections...]
// } for Tutors,
// {
//      connections: [connections...]
// } for others
// Format:
// {
//      "tutorStudent": [
//         {
//             "id",
//             "status",
//             "TargetId",
//             "TargetUsername",
//             "TargetDescription",
//             "CourseId",
//             "courseNum",
//             "campus"
//         }...
//     ],
//     "tutorAdmin": [connections... (see above)]
// } for Tutors
// {
//      "connections": [ // changed, tutorStudent for student, tutorAdmin for admin
//         {
//             "id",
//             "status",
//             "TargetId",
//             "TargetUsername",
//             "TargetDescription",
//             "TargetCampus",
//             "TargetProgramOfStudy",
//             "CourseId",
//             "courseNum",
// //          "campus"
//         }...
//     ]
// } for others
router.get('/account/:accountId', verifyUser,
    async (req, res) => {

    let role = req.user.role;
    const userId = req.user.id;
    const accountId = parseInt(req.params.accountId);

    if (userId !== accountId && role !== 'admin'){ // Invalid access
        res.status(403).send("Unauthorized!")
        return;
    }

    try {
        if (role === 'admin'){
            const requiredUser = await db.sequelize.query(
                `SELECT A.id, A.role AS role
                 FROM "Accounts" A
                 WHERE A."id" = ${accountId}`,
                {
                    // Set this to true if you don't have a model definition for your query.
                    raw: true,
                    // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                    type: db.Sequelize.QueryTypes.SELECT
                }
            )
            if (requiredUser.length === 0){
                role = 'tutor';
            }else {
                role = requiredUser[0].role
            }
        }

        if (role === 'tutor'){
            const query = role => `SELECT C.id,
                    C.status,
                    C."AccountId" AS "TargetId",
                    A.username AS "TargetUsername",
                    A."description" AS "TargetDescription",
                    A.campus AS "TargetCampus",
                    A."programOfStudy" AS "TargetProgramOfStudy",
                    C."CourseId",
                    Co."courseNum",
                    Co."campus"
             FROM "Connections" C JOIN "Accounts" A ON C."AccountId" = A."id"
                                  JOIN "Courses" Co ON C."CourseId" = Co."id"
             WHERE C."TutorId" = ${accountId} AND A.role = '${role}'`;


            const tutorStudent = await db.sequelize.query(query('student'),
                {
                    // Set this to true if you don't have a model definition for your query.
                    raw: true,
                    // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                    type: db.Sequelize.QueryTypes.SELECT
                }
            )
            const tutorAdmin = await db.sequelize.query(query('admin'),
                {
                    // Set this to true if you don't have a model definition for your query.
                    raw: true,
                    // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                    type: db.Sequelize.QueryTypes.SELECT
                }
            )
            res.send({ tutorStudent, tutorAdmin })
        }else {
            const connections = await db.sequelize.query(
                `SELECT C.id,
                    C.status,
                    C."TutorId" AS "TargetId",
                    T.username AS "TargetUsername",
                    T."description" AS "TargetDescription",
                    C."CourseId",
                    Co."courseNum",
                    Co."campus"
                 FROM "Connections" C JOIN "Tutors" T ON C."TutorId" = T."id"
                                      JOIN "Courses" Co ON C."CourseId" = Co."id"
                 WHERE C."AccountId" = ${accountId} OR C."TutorId" = ${accountId}`,
                {
                    // Set this to true if you don't have a model definition for your query.
                    raw: true,
                    // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                    type: db.Sequelize.QueryTypes.SELECT
                }
            )
            if (role === 'admin'){
                res.send({ tutorAdmin: connections })
            }else {
                res.send({ tutorStudent: connections })
            }

        }

    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})


// Adds a new connection
// {
//      accountId: int (OPTIONAL, if current user is tutor, then this id will be a random admin)
//      tutorId: int
//      courseId: int
// }
router.post('/', verifyUser,
    async (req, res) => {

    const userId = req.user.id;
    const role = req.user.role;

    if (userId !== parseInt(req.body.accountId) && userId !== parseInt(req.body.tutorId)){ // Invalid access
        res.status(403).send("Unauthorized!")
        return;
    }

    try {
        let accountId = req.body.accountId;
        if (role === 'tutor' && accountId === undefined){
            const admin = await db.sequelize.query(
                `SELECT A.id
                 FROM "Accounts" A
                 WHERE A."role" = 'admin'
                 ORDER BY random() LIMIT 1`,
                {
                    // Set this to true if you don't have a model definition for your query.
                    raw: true,
                    // The type of query you are executing. The query type affects how results are formatted before they are passed back.
                    type: db.Sequelize.QueryTypes.SELECT
                }
            )
            accountId = admin[0].id;
        }

        db.sequelize.transaction(t => {
            return db.Connection.create({
                status: false,
                AccountId: accountId,
                TutorId: req.body.tutorId,
                CourseId: req.body.courseId
            }, {transaction: t})
                .then(connection => connection)
        }).then(result => {
            res.send(result)
        }).catch(error => {
            console.log(error)
            res.status(400).send('Bad Request')
        })
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})


// Changes status of the connection with the given ID
// TBD: take a req body with new connection status (allow changing status to false)
router.patch('/:connectionId', verifyUser,
    async (req, res) => {

    const userId = req.user.id;

    try {
        const connection = await db.Connection.findByPk(req.params.connectionId)

        if (!connection){
            res.status(400).send("Bad Request!")
            return;
        }

        if (userId !== connection.AccountId && userId !== connection.TutorId){ // Invalid access
            res.status(403).send("Unauthorized!")
            return;
        }

        connection.status = true; // update status
        await connection.save(); // save the change

        res.send(connection)
    }catch (error){
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

export default router;