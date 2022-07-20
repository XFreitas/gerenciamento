const { template } = require("../helpers");
const ContaModel = require("../models/conta");
const PessoaModel = require("../models/pessoa");
const TipocontaModel = require("../models/tipocontas");

module.exports = class ContasBancarias {
    constructor(application) {
        this.application = application;
        this.contaBancariaModel = ContaModel;
    }

    async index(req, res) {
        const data = {};
        data['contasbancarias'] = [];
        try {
            data['contasbancarias'] = await this.contaBancariaModel.findAll();

            for (let index = 0; index < data['contasbancarias'].length; index++) {
                const element = data['contasbancarias'][index];

                data['contasbancarias'][index]['tipoconta'] = await TipocontaModel.findByPk(element.tipoconta);
                data['contasbancarias'][index]['pessoa'] = await PessoaModel.findByPk(element.pessoa);
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

            data['tiposconta'] = [{ value: '', text: 'Selecione' }];
            data['pessoas'] = [{ value: '', text: 'Selecione' }];

            let tipocontas = await TipocontaModel.findAll();
            let pessoas = await PessoaModel.findAll();

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