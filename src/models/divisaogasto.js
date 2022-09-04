'use strict';
const { Op, QueryTypes } = require('sequelize');
const {
    Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');
const Pessoa = require('./pessoa');
const Conta = require('./conta');
const Registro = require('./registro');
const { nArredonda } = require('../helpers');

/**
   *
   * @param {import('sequelize/index').QueryInterface} sequelize
   */
class DivisaoGasto extends MainModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }

    static getData = async params => {
        const data = [],
            getSomaGastos = async id_pessoa => {
                const soma = await sequelize.query(
                    `select sum(abs(Registros.valor)) as soma` + '\n' +
                    `from Registros` + '\n' +
                    `inner join Contas on Contas.id = Registros.conta` + '\n' +
                    `where Contas.pessoa = ?` + '\n' +
                    `    and Registros.divisao = ?` + '\n' +
                    `    and Registros.dataRegistro >= ?` + '\n' +
                    `    and Registros.dataRegistro <= ?` + '\n',
                    {
                        type: QueryTypes.SELECT,
                        replacements: [
                            id_pessoa,
                            1, // Divisao
                            params.data_inicio,
                            params.data_fim,
                        ]
                    }
                );

                if (soma) {
                    return soma[0]['soma'] || 0;
                }

                return 0;
            };

        for (const id_pessoa of params.pessoas) {
            const soma = await getSomaGastos(id_pessoa);

            const pessoa = await Pessoa.findByPk(id_pessoa, {
                attributes: ['nome', 'id']
            });

            data.push({
                pessoa: pessoa.dataValues,
                soma,
                somaformatted: nArredonda(soma, 2, true),
                recebedor: [],
            });
        }

        const somaGeral = data.reduce((acc, cur) => acc + cur.soma, 0);
        const lenDevedores = data.length;
        const paga = nArredonda((somaGeral / lenDevedores), 2);

        const somaDevedores = data.reduce((acc, cur) => acc + (cur.soma < paga ? cur.soma : 0), 0);

        for (let index = 0; index < data.length; index++) {
            const element = data[index];

            for (let j = 0; j < data.length; j++) {
                const v = data[j];
                if (v.pessoa.id != element.pessoa.id) {
                    const p2 = v.soma - paga;
                    var valor = 0;
                    if (p2 > 0) {
                        if (somaDevedores > 0) {
                            valor = nArredonda((p2 * (element.soma / somaDevedores)), 2);
                        } else {
                            valor = paga;
                        }
                    }


                    data[index].recebedor.push({
                        pessoa: v.pessoa.nome,
                        valor,
                        valorformatted: nArredonda(valor, 2, true)
                    });
                }

            }
        }

        return data;
    }
}

DivisaoGasto.init({}, { sequelize });

module.exports = DivisaoGasto;