'use strict';

const sequelize = require('../src/configs/db');
const {
  Sequelize, DataTypes, Model
} = require('sequelize');

module.exports = () => {
  class Tipocontas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tipocontas.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tipocontas',
  });
  return Tipocontas;
};