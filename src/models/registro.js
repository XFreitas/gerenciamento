'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const { MainModel, sequelize } = require('./mainModel');

class Registro extends MainModel {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

  static serverProcessing = (params = {}) => {
    const dataRegistro = "strftime('%d/%m/%Y', Registros.dataRegistro)";

    return MainModel.serverProcessing({
      ...params,
      columns: [
        "pessoa", "nome_banco", "data", "valor",
        "observacao", "id",
      ],
      colsOrder: [
        "pessoa", "nome_banco", "dataRegistro",
        "valor", "observacao",
      ],
      colsWhere: [
        "Pessoas.nome", "Contas.nome_banco", dataRegistro,
        "Registros.valor", "Registros.observacao"
      ],
      priorityGroupColumn: 'Registros.id',
      select: `select Pessoas.nome as pessoa, Contas.nome_banco,` +
        `    strftime('%d/%m/%Y', Registros.dataRegistro) as data,` +
        `    Registros.valor, Registros.observacao, Registros.id, Registros.dataRegistro`,
      from_join: `from Registros\n` +
        `inner join Contas on Contas.id = Registros.conta\n` +
        `inner join Pessoas on Pessoas.id = Contas.pessoa\n`,
    });
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

module.exports = Registro;