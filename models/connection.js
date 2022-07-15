'use strict';
import {Model} from 'sequelize';

const ConnectionModelConstruct = (sequelize, DataTypes) => {
	class Connection extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({Message, Schedule}) {
			// mandatory participation and cascade
			this.hasMany(Message, {foreignKey: {allowNull: false}, onDelete: "CASCADE"})
			this.hasMany(Schedule, {foreignKey: {allowNull: false}, onDelete: "CASCADE"})
		}
	}

	Connection.init({
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
	}, {
		sequelize,
		modelName: 'Connection',
	});
	return Connection;
};

export default ConnectionModelConstruct;
