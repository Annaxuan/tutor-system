'use strict';

import Sequelize from 'sequelize';
import AccountModelConstruct from "./account.js";
import ConnectionModelConstruct from "./connection.js";
import CourseModelConstruct from "./course.js";
import MessageModelConstruct from "./message.js";
import ScheduleModelConstruct from "./schedule.js";
import TutorModelConstruct from "./tutor.js";

const db = {};
console.log(process.env.DATABASE_URL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		protocol: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
	}
);

// manually load constructs
db.Account = AccountModelConstruct(sequelize, Sequelize.DataTypes)
db.Connection = ConnectionModelConstruct(sequelize, Sequelize.DataTypes)
db.Course = CourseModelConstruct(sequelize, Sequelize.DataTypes)
db.Message = MessageModelConstruct(sequelize, Sequelize.DataTypes)
db.Schedule = ScheduleModelConstruct(sequelize, Sequelize.DataTypes)
db.Tutor = TutorModelConstruct(sequelize, Sequelize.DataTypes)

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
