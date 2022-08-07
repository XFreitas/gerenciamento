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

  static serverProcessingRegistros = async (params = {}) => {
    const valorformatted = MainModel.formatNumber('Registros.valor', 2);

    const dataformatted = MainModel.formatDate('Registros.dataRegistro');

    const where = [];

    if (typeof params.conta !== 'undefined') {
      where.push(`Registros.conta = '${params.conta}'`);
      where.push(`Registros.valor < 0`);
      where.push(`Registros.duplicata isnull`);
    } else {
      where.push(`1 = 2`);
    }

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "id", "categoria","observacao",
        "dataformatted", "valorformatted",
      ],
      colsOrder: [
        "id", "categoria","observacao",
        "dataRegistro", "valor"
      ],
      colsWhere: [
        "", "Categorias.nome","Registros.observacao",
        dataformatted, valorformatted,
      ],
      priorityGroupColumn: 'Registros.id',
      select: `select abs(Registros.valor) || '|' || Registros.id as id, Registros.observacao,\n` +
        `  Categorias.nome as categoria, Registros.dataRegistro,` +
        `  Registros.valor, (${valorformatted}) as valorformatted,\n` +
        `  (${dataformatted}) as dataformatted\n`,
      from_join: `from Registros\n` +
        `left join Categorias on Categorias.id = Registros.categoria\n`,
      where: `where ${where.join('\n    and ')}`,
    });

    return a;
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