const CategoriaModel = require('../models/categoria');
const ContaModel = require('../models/conta');
const PessoaModel = require('../models/pessoa');

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
            // if (req.query) {
            //     const id = req.query.id;
            //     data['contabancaria'] = await this.contaBancariaModel.findByPk(id);
            // }

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

    serverProcessing = async (req, res) => {
        let data = {};
        try {
            data = await Registro.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
};