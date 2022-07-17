const { template } = require("../helpers")
const PessoaModel = require("../../models/pessoa");
module.exports = class Pessoas {
    constructor(application) {
        this.application = application;
        this.pessoaModel = PessoaModel();
    }

    async index(req, res) {
        const data = {};
        data['pessoas'] = [];
        try {
            data['pessoas'] = await this.pessoaModel.findAll();
        } catch (error) {
            console.log(error);
        }

        template(this.application, res, "pessoas/index", data);
    }

    async loadmodal(req, res) {
        const data = {};

        try {
            if (req.query) {
                const id = req.query.id;
                data['pessoa'] = await this.pessoaModel.findByPk(id);
            }
            res.render("pessoas/createUpdate", data);
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }

    create(req, res) {
        this.pessoaModel.create({ nome: req.body.nome.toUpperCase() })
            .then(pessoa => {
                console.log(pessoa.id);
                res.status(200).send({ id: pessoa.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }

    update(req, res) {
        this.pessoaModel.update({ nome: req.body.nome.toUpperCase() }, { where: { id: req.body.id } })
            .then(pessoa => {
                console.log(pessoa.id);
                res.status(200).send({ id: pessoa.id });
            }).catch(error => {
                res.status(500).send(error);
                console.log(error);
            });
    }
}