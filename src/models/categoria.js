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

  static serverProcessing = async (params = {}) => {
    const id = `Categorias.id || '-' || Categorias.nivel`;

    return MainModel.serverProcessing({
      ...params,
      columns: ["cod", "categoria", "categoria_pai", "nivel", "id", "id_excluir"],
      colsOrder: ["cod", "categoria", "categoria_pai", "nivel"],
      colsWhere: ["Categorias.id", "Categorias.nome", "Categorias_pai.nome", "Categorias.nivel"],
      priorityGroupColumn: 'Categorias.id',
      select: `SELECT Categorias.id AS cod, Categorias.nome AS categoria, Categorias_pai.nome AS categoria_pai, Categorias.nivel, ${id} AS id, ${id} AS id_excluir`,
      from_join: `FROM Categorias` +
        `\n        LEFT JOIN Categorias AS Categorias_Pai ON Categorias_Pai.id = Categorias.categoria`,
      // where: `WHERE 1 = 2`,
    });
  }
}

Categoria.init({
  categoria: DataTypes.INTEGER,
  nome: DataTypes.STRING,
  nivel: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Categorias',
});


module.exports = Categoria;