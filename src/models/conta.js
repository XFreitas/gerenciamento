'use strict';

const {
  DataTypes, Model
} = require('sequelize');
const { MainModel, sequelize } = require('./mainModel');

class Conta extends MainModel {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

  static serverProcessing = async (params = {}) => {
    const banco = `(Contas.codigo_banco || ' - ' || Contas.nome_banco)`;

    return MainModel.serverProcessing({
      ...params,
      columns: ["cod", "titular", "tipoconta", "banco", "numero", "id"],
      colsOrder: ["cod", "titular", "tipoconta", "banco", "numero"],
      colsWhere: ["Contas.id", "Pessoas.nome", "Tipocontas.nome", banco, "Contas.numero"],
      priorityGroupColumn: 'Contas.id',
      select: `SELECT Contas.id AS cod, Pessoas.nome AS titular, Contas.id,\n` +
        `Tipocontas.nome AS tipoconta, ${banco} AS banco, Contas.numero\n`,
      from_join: `FROM Contas\n` +
        `LEFT JOIN Pessoas ON Pessoas.id = Contas.pessoa\n` +
        `LEFT JOIN Tipocontas ON Tipocontas.id = Contas.tipoconta\n`,
    });
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

module.exports = Conta