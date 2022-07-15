import express from 'express';
import db from '../models/index.js';
import {sequelizeChecker} from "./helper/sequelizeHelper.js";
import {verifyUser} from "../middleware/verifyUser.js";
import moment from "moment-timezone";

const router = express.Router();

// always verify user under schedule route
router.use(verifyUser)
router.use(sequelizeChecker)

/**
 * Query the schedule that:
 *
 * - is about course (represented by courseId)
 * - between date and (date + 24hour)
 * - with client timezone
 *
 * If courseId or date is not present, then the filter will be ignored.
 * If timezone is not provided, UTC will be used
 *
 * Assume: date is in ISO format
 */
router.get('/', async (req, res) => {
	const {courseId, date, timezone} = req.query;
	const role = req.user.role;
	const userId = req.user.id;

	const parsedCourseId = courseId ? parseInt(courseId, 10) : null
	if (parsedCourseId !== null && isNaN(parsedCourseId)) {
		res.status(400).send("Invalid courseId" + courseId)
		return
	}

	const parsedDate = date ? moment(date, moment.ISO_8601) : null
	if (parsedDate !== null && (!parsedDate.isValid())) {
		res.status(400).send("Invalid date " + date)
		return
	}

	const parsedTimezone = timezone ? timezone : "UTC"
	if (parsedTimezone !== null && !!!moment.tz.zone(parsedTimezone)) {
		res.status(400).send("Invalid timezone " + timezone)
		return
	}

	try {
		// query the schedule
		const schedule = await db.sequelize.query(
			`SELECT S.id                                                            AS id,
                    CONCAT(C."courseNum", ' at ', C.campus)                         AS "courseName",
                    S.title                                                         AS title,
                    S.description                                                   AS description,
                    S.datetime                                                      AS date,
                    S.url                                                           AS url,
                    (CASE WHEN :role = 'tutor' THEN A.username ELSE T.username END) AS opponent
             FROM "Schedules" S
                      JOIN "Connections" CONN ON CONN.id = S."ConnectionId"
                      JOIN "Accounts" A ON A.id = CONN."AccountId"
                      JOIN "Tutors" T ON T.id = CONN."TutorId"
                      JOIN "Courses" C ON C.id = CONN."CourseId"
             WHERE (:id = T.id OR :id = A.id)
               AND (:courseId IS NULL OR C.id = :courseId)
               AND (:date IS NULL OR S.datetime AT TIME ZONE :timezone BETWEEN :date::DATE AND :date::DATE + '1 day'::INTERVAL)
             ORDER BY S.datetime; `,
			{
				replacements: {
					id: userId,
					role: role,
					courseId: parsedCourseId,
					date: parsedDate ? parsedDate.toISOString(true) : parsedDate,
					timezone: parsedTimezone
				},
				// Set this to true if you don't have a model definition for your query.
				raw: true,
				// The type of query you are executing. The query type affects how results are formatted before they are passed back.
				type: db.Sequelize.QueryTypes.SELECT
			}
		)
		// query the courses this user has, plus some aggregation
		const courses = await db.sequelize.query(
			`SELECT C.id                                    AS "id",
                    CONCAT(C."courseNum", ' at ', C.campus) AS "name",
                    (COUNT(S.id) FILTER
                        (WHERE CASE
                                   WHEN :date IS NULL THEN DATE_TRUNC('day', S.datetime AT TIME ZONE :timezone) >= DATE_TRUNC('day', NOW() AT TIME ZONE :timezone)
                                   ELSE S.datetime AT TIME ZONE :timezone BETWEEN :date::DATE AND :date::DATE + '1 day'::INTERVAL END)
                        ) > 0                               AS "hasSchedule"
             FROM "Schedules" S
                      JOIN "Connections" CONN on CONN.id = S."ConnectionId"
                      JOIN "Courses" C ON CONN."CourseId" = C.id
             WHERE (:id = CONN."TutorId" OR :id = CONN."AccountId")
             GROUP BY C.id, C."courseNum", C.campus`,
			{
				replacements: {
					id: userId,
					date: parsedDate ? parsedDate.toISOString(true) : parsedDate,
					timezone: parsedTimezone
				},
				// Set this to true if you don't have a model definition for your query.
				raw: true,
				// The type of query you are executing. The query type affects how results are formatted before they are passed back.
				type: db.Sequelize.QueryTypes.SELECT
			}
		)
		// query the date that is available for this user
		const occupiedDatesRaw = await db.sequelize.query(
			`SELECT DATE_TRUNC('day', S.datetime AT TIME ZONE :timezone) AS "occupiedDate"
             FROM "Schedules" S
                      JOIN "Connections" CONN ON CONN.id = S."ConnectionId"
                      JOIN "Courses" C ON C.id = CONN."CourseId"
             WHERE (:id = CONN."TutorId" OR :id = CONN."AccountId")
               AND (:courseId IS NULL OR C.id = :courseId)
             GROUP BY "occupiedDate"
             ORDER BY "occupiedDate"; `,
			{
				replacements: {
					id: userId,
					courseId: parsedCourseId,
					timezone: parsedTimezone
				},
				// Set this to true if you don't have a model definition for your query.
				raw: true,
				// The type of query you are executing. The query type affects how results are formatted before they are passed back.
				type: db.Sequelize.QueryTypes.SELECT
			}
		)
		// transform the occupied date to a list of dates
		const occupiedDates = occupiedDatesRaw.map(row => row.occupiedDate)
		res.send({schedule, courses, occupiedDates})
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

/**
 * Create a new schedule for the connection (identified with connectionId)
 *
 * Assume: date is in ISO format
 */
router.post('/:connectionID', async (req, res, next) => {
	const {connectionID} = req.params;
	const userId = req.user.id;

	// check if connectionId is owned by the user id
	const connection = await db.Connection.findByPk(connectionID)
	if (!connection) {
		res.status(404).send("Connection not found")
	} else if (connection.TutorId !== userId && connection.AccountId !== userId) {
		res.status(403).send("You don't have access to this connection")
	} else {
		next()
	}
}, async (req, res) => {
	const {connectionID} = req.params;
	const {title, description, datetime, url} = req.body

	const parsedDate = datetime ? moment(datetime, moment.ISO_8601) : null
	if (parsedDate !== null && (!parsedDate.isValid())) {
		res.status(400).send("Invalid date " + datetime)
		return
	}

	try {
		await db.sequelize.transaction(async (t) => {
			await db.Schedule.create({
				title: title,
				description: description,
				datetime: parsedDate ? parsedDate.toISOString(true) : parsedDate,
				url: url,
				ConnectionId: connectionID
			}, {transaction: t})
		})

		res.send("Schedule created")
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}

})

export default router;