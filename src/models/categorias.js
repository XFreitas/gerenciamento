'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Categorias.init({
    categoria: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    nivel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categorias',
  });
  return Categorias;
};