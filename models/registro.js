'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registro extends Model {
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
    modelName: 'Registro',
  });
  return Registro;
};