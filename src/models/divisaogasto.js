'use strict';
const { Op } = require('sequelize');
const {
    Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');
const Pessoa = require('./pessoa');
const Conta = require('./conta');
const Registro = require('./registro');

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
            getRegistros = async id_conta => {
                const dataRegistros = [];
                const registros = await Registro.findAll({
                    attributes: [
                        [MainModel.formatDate('dataRegistro'), 'dataRegistroFormatted'],
                        'dataRegistro',
                        [MainModel.formatNumber('valor', 2), 'valorFormatted'],
                        'valor',
                        'observacao'],
                    where: {
                        conta: { [Op.eq]: id_conta },
                        dataRegistro: { [Op.between]: [params.data_inicio, params.data_fim] },
                        divisao: { [Op.eq]: 1 }// 1 = divisão gastos
                    },
                    order: [['dataRegistro', 'ASC']]
                });

                if (registros) {
                    registros.forEach((registro, idx) => {
                        dataRegistros.push(registro.dataValues);
                    });
                }

                return dataRegistros;
            },
            getContas = async id_pessoa => {
                const dataContas = [];
                const contas = await Conta.findAll({
                    attributes: ['id', 'numero', 'nome_banco'],
                    where: { pessoa: { [Op.eq]: id_pessoa } }
                });

                if (contas) {
                    for (const key in contas) {
                        if (Object.hasOwnProperty.call(contas, key)) {
                            const conta = contas[key];
                            dataContas.push({
                                conta: conta.dataValues,
                                registros: await getRegistros(conta.id)
                            });
                        }
                    }
                }

                return dataContas;
            };

        for (const id_pessoa of params.pessoas) {
            const pessoa = await Pessoa.findByPk(id_pessoa, {
                attributes: ['id', 'nome']
            });
            data.push({
                pessoa: pessoa.dataValues,
                contas: await getContas(id_pessoa)
            });
        }

        return data;
    }
}

DivisaoGasto.init({}, { sequelize });

module.exports = DivisaoGasto;