const { template } = require("../helpers")
const PessoaModel = require("../models/pessoa");
module.exports = class Pessoas {
    constructor(application) {
        this.application = application;
    }

    index(req, res) {
        template(this.application, res, "pessoas/index", {});
    }

    async loadmodal(req, res) {
        const data = {};

        try {
            if (req.query) {
                const id = req.query.id;
                data['pessoa'] = await PessoaModel.findByPk(id);
            }
            res.render("pessoas/createUpdate", data);
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }

    create(req, res) {
        PessoaModel.create({ nome: req.body.nome.toUpperCase() })
            .then(pessoa => {
                console.log(pessoa.id);
                res.status(200).send({ id: pessoa.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }

    update(req, res) {
        PessoaModel.update({ nome: req.body.nome.toUpperCase() }, { where: { id: req.body.id } })
            .then(pessoa => {
                console.log(pessoa.id);
                res.status(200).send({ id: pessoa.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }

    async serverProcessing(req, res) {
        const data = {};
        data['pessoas'] = [];
        try {
            data['pessoas'] = await PessoaModel.serverProcessing();
        } catch (error) {
            console.log(error);
        }
    }
}