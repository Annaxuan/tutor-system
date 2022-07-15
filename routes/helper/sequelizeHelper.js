import db from "../../models/index.js";
import {isTutorId} from "./idValidationHelper.js";

function sequelizeChecker(req, res, next) {
	db.sequelize.authenticate()
		.then(() => {
			next()
		})
		.catch(_ => {
			res.status(500).send('Internal server error')
		})
}

function isSequelizeError(error, subclass) {
	if (subclass) {
		return error instanceof db.Sequelize[subclass]
	} else {
		return error instanceof db.Sequelize.Error
	}
}

/**
 * Find the and Account in the Tutor/Account Table by the Primary Key (id),
 *
 * This method exploit the fact that the id in the two table is disjoint.
 *
 * Throws error if not found (or execute `notFoundHandler` if it's defined)
 */
const findTutorOrAccountByPK = async (id, notFoundHandler) => {
	let account;
	if (isTutorId(id)) {
		account = await db.Tutor.findByPk(id)
	} else {
		account = await db.Account.findByPk(id)
	}
	// returns the account if it exists, otherwise throw error
	if (account) {
		return account;
	} else if (notFoundHandler) {
		notFoundHandler()
	} else {
		throw new Error(`Cannot find account with ${id}`)
	}
}

export {
	sequelizeChecker,
	isSequelizeError,
	findTutorOrAccountByPK
}