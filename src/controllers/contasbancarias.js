const { template } = require("../helpers")
const Tipocontas = require('../../models/tipocontas');
class ContasBancarias {
    constructor(application) {
        this.application = application;
    }

    index(req, res) {
        template(this.application, res, "contasbancarias/index", {});
    }

    async create(req, res) {
        const tipoconta = Tipocontas();
        let options = [{ '': 'Selecione' }];

        let tipocontas = await tipoconta.findAll();

        console.log(tipocontas.map(tipoconta => {
            let id = tipoconta.id;
            let value = tipoconta.nome;
            return { id, value };
        }));

        res.render("contasbancarias/createUpdate", {});
    }
}

module.exports = ContasBancarias;