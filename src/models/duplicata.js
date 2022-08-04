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

  static serverProcessing = async (params = {}) => {
    const valorformatted = MainModel.formatNumber('Duplicatas.valor', 2);

    const valorpagoformatted = MainModel.formatNumber('Duplicatas.valorpago', 2);

    const dataformatted = MainModel.formatDate('Duplicatas.data');

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "id", "pessoa", "categoria",
        "dataformatted", "valorformatted",
        "valorpagoformatted", "id"
      ],
      colsOrder: [
        "id", "pessoa", "categoria",
        "data", "valor", "valorpago"
      ],
      colsWhere: [
        "", "Pessoas.nome", "Categorias.nome",
        dataformatted, valorformatted, valorpagoformatted
      ],
      priorityGroupColumn: 'Duplicatas.id',
      select: `select Duplicatas.id, Pessoas.nome as pessoa,\n` +
        `  Categorias.nome as categoria, Duplicatas.data,` +
        `  Duplicatas.valor, (${valorformatted}) as valorformatted,\n` +
        `  (${dataformatted}) as dataformatted, Duplicatas.valorpago,\n` +
        `  (${valorpagoformatted}) as valorpagoformatted\n`,
      from_join: `from Duplicatas\n` +
        `left join Categorias on Categorias.id = Duplicatas.categoria\n` +
        `left join Contas on Contas.id = Duplicatas.conta\n` +
        `left join Pessoas on Pessoas.id = Contas.pessoa`,
    });

    return a;
  }
}

Duplicata.init({
  conta: DataTypes.INTEGER,
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