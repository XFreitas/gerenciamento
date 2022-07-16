'use strict';

const sequelize = require('../src/configs/db');
const {
  DataTypes, Model
} = require('sequelize');

module.exports = () => {
  class Pessoa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pessoa.init({
    nome: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Pessoa',
  });
  return Pessoa;
};