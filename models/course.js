'use strict';
import {Model} from 'sequelize';

const CourseModelConstruct = (sequelize, DataTypes) => {
	class Course extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({Connection}) {
			this.hasMany(Connection, {foreignKey: {allowNull: false}, onDelete: "CASCADE"})
		}
	}

	Course.init({
		courseNum: {
			type: DataTypes.STRING,
			allowNull: false
		},
		courseName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		courseInfo: {
			type: DataTypes.STRING(1024),
			allowNull: false
		},
		campus: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: {
					args: [["St. George", "Scarborough", "Mississauga"]],
					msg: "Must be valid UofT campus"
				},
			}
		},
	}, {
		sequelize,
		modelName: 'Course',
	});
	return Course;
};

export default CourseModelConstruct;
