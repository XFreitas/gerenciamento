const { template } = require("../helpers")

module.exports = class Pessoas {
    constructor(application) {
        this.application = application;
    }

    index(req, res) {
        template(this.application, res, "pessoas/index", {});
    }

    loadmodal(req, res) {
        const data = {};

        res.render("pessoas/createUpdate", data);
    }

    create(req, res) {
        console.log(req.body);

        const PessoaModel = require("../../models/pessoa");
        const pessoaModel = PessoaModel();

        pessoaModel.create(req.body).then(pessoa => {
            console.log(pessoa.id);
        });

        res.send("create");
    }
}