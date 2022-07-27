'use strict';

// const sequelize = require('../configs/db');
const {
  DataTypes, Model
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class Pessoa extends MainModel {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

  static serverProcessing = async (params = {}) => MainModel.serverProcessing({
    ...params,
    columns: ["cod", "nome", "id"],
    colsOrder: ["cod", "nome"],
    colsWhere: ["id", "nome"],
    priorityGroupColumn: 'id',
    select: `SELECT id AS cod, nome, id`,
    from_join: `FROM Pessoas`,
  });
}

Pessoa.init({
  nome: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Pessoas',
});

module.exports = Pessoa;