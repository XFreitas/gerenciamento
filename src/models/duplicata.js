'use strict';
const {
  DataTypes
} = require('sequelize');
const { MainModel, sequelize } = require('./mainModel');

class Duplicata extends MainModel {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Duplicata.init({
  categoria: DataTypes.INTEGER,
  data: DataTypes.DATE,
  valor: DataTypes.DECIMAL,
  valorpago: DataTypes.DECIMAL,
  observacao: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Duplicatas',
});

module.exports = Duplicata;