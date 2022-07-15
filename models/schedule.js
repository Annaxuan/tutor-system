'use strict';
import {Model} from 'sequelize';

const ScheduleModelConstruct = (sequelize, DataTypes) => {
	class Schedule extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate() {
		}
	}

	Schedule.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(1024),
		},
		datetime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		url: {
			type: DataTypes.STRING(1024),
			allowNull: false
		},
	}, {
		sequelize,
		modelName: 'Schedule',
	});
	return Schedule;
};

export default ScheduleModelConstruct;
