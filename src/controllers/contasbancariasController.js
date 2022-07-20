const { template } = require("../helpers");
const ContaBancariaModel = require("../../models/conta");

module.exports = class ContasBancarias {
    constructor(application) {
        this.application = application;
        this.contaBancariaModel = ContaBancariaModel();
    }

    async index(req, res) {
        const data = {};
        data['contasbancarias'] = [];
        try {
            data['contasbancarias'] = await this.contaBancariaModel.findAll();

            const tipocontas = require('../../models/tipocontas')();
            const pessoa = require('../../models/pessoa')();


            for (let index = 0; index < data['contasbancarias'].length; index++) {
                const element = data['contasbancarias'][index];

                data['contasbancarias'][index]['tipoconta'] = await tipocontas.findByPk(element.tipoconta);
                data['contasbancarias'][index]['pessoa'] = await pessoa.findByPk(element.pessoa);
            }
        } catch (error) {
            console.log(error);
        }

        template(this.application, res, "contasbancarias/index", data);
    }

    async showmodal(req, res) {
        const data = {};
        try {
            if (req.query) {
                const id = req.query.id;
                data['contabancaria'] = await this.contaBancariaModel.findByPk(id);
            }

            const tipoconta = require('../../models/tipocontas')();
            const pessoa = require('../../models/pessoa')();

            data['tiposconta'] = [{ value: '', text: 'Selecione' }];
            data['pessoas'] = [{ value: '', text: 'Selecione' }];

            let tipocontas = await tipoconta.findAll();
            let pessoas = await pessoa.findAll();

            tipocontas.forEach(tipoconta => {
                data['tiposconta'].push({
                    value: tipoconta.id,
                    text: tipoconta.nome,
                });
            });

            pessoas.forEach(pessoa => {
                data['pessoas'].push({
                    value: pessoa.id,
                    text: pessoa.nome,
                });
            });
        } catch (error) {
            console.log(error);
        }
console.log(data);
        res.render("contasbancarias/createUpdate", data);
    }

    async create(req, res) {
        const data = {};

        this.contaBancariaModel.create(req.body)
            .then(contabancaria => {
                console.log(contabancaria.id);
                res.status(200).send({ id: contabancaria.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }
}