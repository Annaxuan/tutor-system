import {verifyAdmin} from "../../middleware/verifyUser.js";
import {findTutorOrAccountByPK} from "../helper/sequelizeHelper.js";
import db from "../../models/index.js";
import express from "express";
import {deleteBatch, deleteSingle, list, MessageFileListReference, MessageFileReference, UserProfilePictureReference} from "../helper/fileUploadHelper.js";

const adminRoute = express.Router();

// admin routes requires admin access
adminRoute.use(verifyAdmin);

/**
 * Get the information on all user
 *
 * Require admin access
 */
adminRoute.get('/allAccount', async (req, res) => {
	const {role, campus, query} = req.query

	try {
		const allAccounts = await db.sequelize.query(
			`SELECT *
             FROM (SELECT T.id,
                          T.username,
                          T.email,
                          T.role,
                          T.description,
                          NULL as campus,
                          NULL as "programOfStudy"
                   FROM "Tutors" T
                   UNION ALL
                   SELECT A.id,
                          A.username,
                          A.email,
                          A.role,
                          A.description,
                          A.campus,
                          A."programOfStudy"
                   FROM "Accounts" A) as ACCOUNTS
             WHERE (:role IS NULL OR ACCOUNTS.role = :role)
               AND (:campus IS NULL OR ACCOUNTS.campus = :campus)
               AND (:query IS NULL OR CAST(ACCOUNTS.id AS TEXT) = :query
                 OR ACCOUNTS.username LIKE :wildcardQuery
                 OR ACCOUNTS.email LIKE :wildcardQuery
                 OR ACCOUNTS."programOfStudy" LIKE :wildcardQuery
                 OR ACCOUNTS.description LIKE :wildcardQuery)
             ORDER BY id;`,
			{
				replacements: {
					role: role ? role : null,
					campus: campus ? campus : null,
					query: query ? query : null,
					wildcardQuery: query ? `%${query}%` : null,
				},
				// Set this to true if you don't have a model definition for your query.
				raw: true,
				// The type of query you are executing. The query type affects how results are formatted before they are passed back.
				type: db.Sequelize.QueryTypes.SELECT
			}
		)

		res.send(allAccounts)
	} catch (error) {
		console.log(error)
		res.status(500).send('Internal server error')
	}
})

/**
 * Delete a user
 *
 * Require admin access
 */
adminRoute.delete('/:id', async (req, res) => {
	const {id} = req.params

	try {
		const account = await findTutorOrAccountByPK(id, () => res.status(404).send("Could not find account"))

		await db.sequelize.transaction(async (t) => {
			// delete the profile image from bucket
			const profilePictureReference = new UserProfilePictureReference(account.id)
			await deleteSingle(profilePictureReference)

			// for each connection, delete the files associated with it
			const connections = await account.getConnections()
			for(const connection of connections) {
				const fileListReference = new MessageFileListReference(connection.id);
				// retrieve all files
				let hasNextList = true
				let marker = null
				const files = []
				while(hasNextList) {
					const fileListResult = await list(fileListReference, 100, marker)
					files.push(...fileListResult.Contents)
					hasNextList = fileListResult.HasNextList
					marker = fileListResult.NextMarker
				}
				// remove all files
				await deleteBatch(files.map(MessageFileReference.fromListReferenceResult))
			}

			await account.destroy({transaction: t});
		})

		res.send("Deleted")
	} catch (error) {
		console.log(error)
		res.status(500).send('Internal server error')
	}
})

export default adminRoute;
