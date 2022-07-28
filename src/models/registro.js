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
    const dataRegistro = "strftime('%w-%d/%m/%Y', Registros.dataRegistro)";
    const categoria = "coalesce(Categorias.nome, 'Sem categoria')";

    const { nArredonda, removeVirgulaPonto } = require('../helpers/index');

    if (params.columnsSearch3 != '') {
      params.columnsSearch3 = removeVirgulaPonto(params.columnsSearch3);
    }

    const where = ['where 1 = 1'];

    if (typeof params.conta !== 'undefined') {
      where.push(`Registros.conta = ${params.conta}`);
    }

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "categoria", "data", "valor",
        "observacao", "id",
      ],
      colsOrder: [
        "categoria", "dataRegistro",
        "valor", "observacao",
      ],
      colsWhere: [
        categoria, dataRegistro,
        "Registros.valor", "Registros.observacao"
      ],
      priorityGroupColumn: 'Registros.id',
      select: `select ${categoria} as categoria,` +
        `    ${dataRegistro} as data,` +
        `    Registros.valor, Registros.observacao, Registros.id, Registros.dataRegistro`,
      from_join: `from Registros\n` +
        `left join Categorias on Categorias.id = Registros.categoria\n`,
      where: where.join('\n    and '),
    });


    for (let index = 0; index < a.data.length; index++) {
      a.data[index][2] = nArredonda(a.data[index][2], 2, true);

      const data = a.data[index][1].split('-');
      a.data[index][1] = `${weekdays[data[0]]} ${data[1]}`;
    }

    return a;
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