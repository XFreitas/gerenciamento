const { template } = require("../helpers")

module.exports = class ContasBancarias {
    constructor(application) {
        this.application = application;
    }

    index(req, res) {
        template(this.application, res, "contasbancarias/index", {});
    }

    async create(req, res) {
        const data = {};
        try {
            const Tipocontas = require('../../models/tipocontas');
            const tipoconta = Tipocontas();
            data['options'] = [{ value: '', text: 'Selecione' }];

            let tipocontas = await tipoconta.findAll();

            tipocontas.forEach(tipoconta => {
                data['options'].push({
                    value: tipoconta.id,
                    text: tipoconta.nome,
                });
            });
        } catch (error) {
            console.log(error);
        }

        res.render("contasbancarias/createUpdate", data);
    }
}