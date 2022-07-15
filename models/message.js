'use strict';
import {Model} from 'sequelize';

const MessageModelConstruct = (sequelize, DataTypes) => {
	class Message extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate() {
		}
	}

	Message.init({
		content: {
			type: DataTypes.STRING(1024),
			allowNull: false
		},
		sender: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		dateTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Message',
	});
	return Message;
};

export default MessageModelConstruct;
