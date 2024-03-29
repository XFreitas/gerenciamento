'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const { MainModel, sequelize } = require('./mainModel');

const weekdays = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb'
];

class Registro extends MainModel {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

  static serverProcessing = async (params = {}) => {

    const valorformatted = MainModel.formatNumber('Registros.valor', 2);

    const dataRegistro = MainModel.formatDate('Registros.dataRegistro');

    const where = ['where 1 = 1'];

    if (typeof params.conta !== 'undefined') {
      where.push(`Registros.conta = '${params.conta}'`);
    }

    const divisaoformatted = "(CASE WHEN COALESCE(Registros.divisao, 0) = 0 THEN '' ELSE 'SIM' END)";

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "id", "categoria", "data", "valorformatted",
        "observacao", "divisaoformatted", "id",
      ],
      colsOrder: [
        '', "categoria", "dataRegistro",
        "valor", "observacao", "divisao",
      ],
      colsWhere: [
        '', 'Categorias.nome', dataRegistro,
        valorformatted, "Registros.observacao", divisaoformatted
      ],
      priorityGroupColumn: 'Registros.id',
      select: `select Categorias.nome as categoria,` +
        `    (${dataRegistro}) as data,` +
        `    (${valorformatted}) as valorformatted,` +
        `    ${divisaoformatted} as divisaoformatted,` +
        `    Registros.observacao, Registros.id,` +
        `    Registros.dataRegistro, Registros.valor, COALESCE(Registros.divisao, 0) as divisao`,
      from_join: `from Registros\n` +
        `left join Categorias on Categorias.id = Registros.categoria\n`,
      where: where.join('\n    and '),
    });

    return a;
  }
}
Registro.init({
  categoria: DataTypes.INTEGER,
  conta: DataTypes.INTEGER,
  duplicata: DataTypes.INTEGER,
  dataRegistro: DataTypes.DATE,
  valor: DataTypes.DECIMAL,
  divisao: DataTypes.INTEGER,
  observacao: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Registros',
});

module.exports = Registro;