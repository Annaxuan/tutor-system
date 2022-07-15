import {findTutorOrAccountByPK, isSequelizeError, sequelizeChecker} from "../helper/sequelizeHelper.js";
import {comparePassword, encrypt, validatePassword} from "../helper/passwordHelper.js";
import db from "../../models/index.js";
import express from "express";

const infoRoute = express.Router();

/**
 * Get the information on the currently logged-in user
 */
infoRoute.get('/', async (req, res) => {
	const userId = req.user.id;

	try {
		const account = await findTutorOrAccountByPK(userId)
		res.send(account)
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

/**
 * Set the information on the currently logged-in user
 */
infoRoute.patch('/', (req, res, next) => {
	// validate the patch is valid
	const role = req.user.role;
	const payload = req.body
	if (role === "admin" && (payload.description || payload.campus || payload.programOfStudy)) {
		res.status(400).send("Admin don't support update description, campus, programOfStudy")
	} else if (role === "tutor" && (payload.campus || payload.programOfStudy)) {
		res.status(400).send("Tutor don't support update campus, programOfStudy")
	} else {
		next()
	}
}, async (req, res) => {
	const userId = req.user.id;

	try {
		const account = await findTutorOrAccountByPK(userId)

		const setField = async (key, value) => {
			account[key] = value
			await account.validate()
		}

		const changePassword = async ({oldPassword, newPassword}) => {
			// 1. check if the oldPassword is correct
			if (!await comparePassword(oldPassword, account.password)) {
				res.status(400)
				throw `Incorrect password`
			}
			// 2. validate the new password
			const validationMessage = await validatePassword(newPassword)
			if (validationMessage) {
				res.status(400)
				throw validationMessage
			}
			// 3. set the encrypted new password
			account.password = await encrypt(newPassword)
		}

		const updatedAccount = await db.sequelize.transaction(async (t) => {
			for (const [key, value] of Object.entries(req.body)) {
				switch (key) {
					case "email":
					case "description":
					case "campus":
					case "programOfStudy":
						await setField(key, value)
						break
					case "password":
						await changePassword(value)
						break
					case "profilePicture":
						throw `Profile picture is not patched here`
					default:
						throw `Invalid field ${key}`
				}
			}
			return await account.save({transaction: t})
		})

		res.send(updatedAccount)
	} catch (error) {
		console.error(error)
		if (!res.statusCode) {
			res.status(500).send("Internal Server Error")
		} else if (isSequelizeError(error, "ValidationError")) {
			res.status(400).send(error.message)
		} else {
			res.send(error)
		}
	}
})

export default infoRoute;
