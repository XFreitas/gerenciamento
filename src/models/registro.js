'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const { MainModel, sequelize } = require('./mainModel');

module.exports = (sequelize, DataTypes) => {
  class Registro extends MainModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Registro.init({
    categoria: DataTypes.INTEGER,
    conta: DataTypes.INTEGER,
    dataRegistro: DataTypes.DATE,
    valor: DataTypes.DECIMAL,
    observacao: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Registros',
  });
  return Registro;
};