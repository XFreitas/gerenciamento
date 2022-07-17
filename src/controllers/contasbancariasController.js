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
        } catch (error) {
            console.log(error);
        }

        template(this.application, res, "contasbancarias/index", data);
    }

    async create(req, res) {
        const data = {};
        try {
            const Tipocontas = require('../../models/tipocontas');
            const tipoconta = Tipocontas();

            const Pessoa = require('../../models/pessoa');
            const pessoa = Pessoa();

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

        res.render("contasbancarias/createUpdate", data);
    }
}