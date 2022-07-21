'use strict';
const {
  Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class Categoria extends MainModel {
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
    columns: ["cod", "categoria", "categoria_pai", "nivel", "id"],
    colsOrder: ["cod", "categoria", "categoria_pai", "nivel"],
    colsWhere: ["Categorias.id", "Categorias.nome", "Categorias_pai.nome", "Categorias.nivel"],
    priorityGroupColumn: 'Categorias.id',
    select: `SELECT Categorias.id AS cod, Categorias.nome AS categoria, Categorias_pai.nome AS categoria_pai, Categorias.nivel, Categorias.id`,
    from_join: `FROM Categorias` +
      `\n        LEFT JOIN Categorias AS Categorias_Pai ON Categorias_Pai.id = Categorias.categoria`,
  });
}

Categoria.init({
  categoria: DataTypes.INTEGER,
  nome: DataTypes.STRING,
  nivel: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Categoria',
});


module.exports = Categoria;