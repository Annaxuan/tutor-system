'use strict';
import {Model} from 'sequelize';

const TutorModelConstruct = (sequelize, DataTypes) => {
	class Tutor extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({Connection}) {
			this.hasMany(Connection, {foreignKey: {allowNull: false}, onDelete: "CASCADE"})
		}

		toJSON() {
			return {...this.get(), password: undefined}; // don't expose the password
		}
	}

	Tutor.init({
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: {
					msg: "Must be valid email",
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: {
					args: [["tutor"]],
					msg: "Must be tutor"
				}
			}
		},
		description: {
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'Tutor',
	});
	return Tutor;
};

export default TutorModelConstruct;
