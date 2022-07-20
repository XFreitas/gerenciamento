'use strict';

const sequelize = require('../configs/db');
const {
  DataTypes, Model
} = require('sequelize');

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

module.exports = Tipocontas;