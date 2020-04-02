'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    date: DataTypes.DATEONLY,
    genre: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    year: DataTypes.INTEGER,
    quote: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Movie.associate = function(models) {
    Movie.belongsTo(models.User)
  };
  return Movie;
};