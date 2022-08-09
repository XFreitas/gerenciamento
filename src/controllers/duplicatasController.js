const CategoriaModel = require('../models/categoria');
const ContaModel = require('../models/conta');
const PessoaModel = require('../models/pessoa');
const DuplicataModel = require('../models/duplicata');
const { nArredonda } = require('../helpers');
const moment = require('moment');

module.exports = class Duplicatas {
    constructor(application) {
        this.application = application;
    }

    index = async (req, res) => {
        const data = {};

        require("../helpers").template(this.application, res, "duplicatas/index", data);
    }

    showModal = async (req, res) => {
        const data = {};
        try {
            data['duplicata'] = null;
            if (req.query.id) {
                const id = req.query.id;
                data['duplicata'] = await DuplicataModel.findByPk(id);
                data['duplicata'].valor = nArredonda(data['duplicata'].valor, 2, true);
            }

            data['categorias'] = [{ value: '', text: 'Selecione' }];
            data['contas'] = [{ value: '', text: 'Selecione' }];

            let categorias = await CategoriaModel.findAll();
            let contas = await ContaModel.findAll();

            categorias.forEach(tipoconta => {
                data['categorias'].push({
                    value: tipoconta.id,
                    text: tipoconta.nome,
                });
            });

            for (const key in contas) {
                if (Object.hasOwnProperty.call(contas, key)) {

                    const conta = contas[key];
                    const pessoa = await PessoaModel.findByPk(conta.pessoa);

                    data['contas'].push({
                        value: conta.id,
                        text: `${pessoa.nome} - ${conta.numero}`,
                    });
                }
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        console.log(data);
        res.render("duplicatas/createUpdate", data);
    }

    showModalPagar = async (req, res) => {
        const data = {};
        try {
            const id = req.query.id;
            data['duplicata'] = await DuplicataModel.findByPk(id);
            data['duplicata'].valor = nArredonda(data['duplicata'].valor, 2, true);
            data['duplicata'].valorpago = nArredonda(data['duplicata'].valorpago, 2, true);
            data['duplicata'].formattedData = moment(data['duplicata'].data).format('DD/MM/YYYY');
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        console.log(data);
        res.render("duplicatas/pagar", data);
    }

    create(req, res) {
        DuplicataModel.create(req.body)
            .then(duplicata => {
                console.log(duplicata.id);
                res.status(200).send({ id: duplicata.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }

    update(req, res) {
        DuplicataModel.update(req.body, { where: { id: req.body.id } })
            .then(duplicata => {
                console.log(duplicata.id);
                res.status(200).send({ id: duplicata.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }

    async pagar(req, res) {
        try {
            const registros = req.body.registros;
            const RegistroModel = require('../models/registro');

            const duplicata = await DuplicataModel.findByPk(req.body.id);
            let valorPago = nArredonda(duplicata.valorpago ?? '0', 2);

            for (let index = 0; index < registros.length; index++) {
                const id = registros[index];

                const registro = await RegistroModel.findByPk(id);

                valorPago += Math.abs(nArredonda(registro.valor, 2));

                registro.update({
                    duplicata: duplicata.id,
                });
            }

            duplicata.update({
                valorpago: valorPago,
            });

            res.status(200).send('OK');
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }

    serverProcessingRegistros = async (req, res) => {
        let data = {};
        try {
            data = await DuplicataModel.serverProcessingRegistros(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }

    serverProcessing = async (req, res) => {
        let data = {};
        try {
            data = await DuplicataModel.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
};