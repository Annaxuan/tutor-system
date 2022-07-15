'use strict';
import {Model} from 'sequelize';

const AccountModelConstruct = (sequelize, DataTypes) => {
	class Account extends Model {
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

	Account.init({
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
					args: [["admin", "student"]],
					msg: "Must be admin or student"
				}
			}
		},
		description: {
			type: DataTypes.STRING,
			defaultValue: null
		},
		campus: {
			type: DataTypes.STRING,
			validate: {
				isIn: {
					args: [["St. George", "Scarborough", "Mississauga"]],
					msg: "Must be one of (St. George, Scarborough, Mississauga)"
				}
			}
		},
		programOfStudy: {
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'Account',
	});
	return Account;
};

export default AccountModelConstruct;
