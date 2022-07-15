import db from './models/index.js';

/**
 * Note: running this script can be destructive.
 */

db.sequelize
	.sync({alter: true})
	// Account id always odd
	.then(s => db.sequelize.query(`ALTER SEQUENCE "Accounts_id_seq" START 1 INCREMENT 2`))
	// Tutor id always even
	.then(s => db.sequelize.query(`ALTER SEQUENCE "Tutors_id_seq" START 2 INCREMENT 2`))
	.then(s => console.log("DB Created"));
