'use strict';
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize;

  class User extends Model {
    checkPassword(password) {
      return comparePassword(password, this.password);
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required'
        },
        notEmpty: {
          msg: 'Name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Email is not valid'
        },
        isUnique: (value, next) => {
          User.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), value)
          }).then(data => {
            if(data) {
              next('This e-mail has been registered');
            } else {
              next();
            }
          }).catch(err => {
            next(err);
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required'
        },
        notEmpty: {
          msg: 'Password is required'
        }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeValidate: (user, options) => {
        if(user.email) {
          user.email = user.email.toLowerCase();
        }
      },
      beforeCreate: (user, options) => {
        if(user.password) {
          user.password = hashPassword(user.password);
        }
      },
      beforeUpdate: (user, options) => {
        if(user.password) {
          user.password = hashPassword(user.password);
        }
      },
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Movie)
  };
  return User;
};