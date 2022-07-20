'use strict';

const sequelize = require('../src/configs/db');
const {
  DataTypes, Model
} = require('sequelize');

module.exports = () => {
  class Conta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Conta.init({
    tipoconta: DataTypes.INTEGER,
    pessoa: DataTypes.INTEGER,
    numero: DataTypes.TEXT,
    codigo_banco: DataTypes.TEXT,
    nome_banco: DataTypes.TEXT,
    descricao: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Contas',
  });
  return Conta;
};