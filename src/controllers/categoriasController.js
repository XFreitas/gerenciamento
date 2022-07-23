const CategoriaModel = require("../models/categoria");

module.exports = class Categorias {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        require("../helpers").template(this.application, res, "categorias/index", {});
    }

    createupdate = async (req, res) => {
        const data = {};
        try {
            if (req.query) {
                const id = req.query.id;
                data['categoria'] = await CategoriaModel.findByPk(id);
            }

            const categorias = await CategoriaModel.findAll({
                order: [["nome", "ASC"]],
            });
            data['categorias'] = [{ value: '', text: 'Selecione' }];
            categorias.forEach(categoria => {
                data['categorias'].push({
                    value: categoria.id,
                    text: categoria.nome,
                });
            });
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        console.log(data);
        res.render("categorias/createUpdate", data);
    }

    serverProcessing = async (req, res) => {
        var data = {};
        try {
            data = await CategoriaModel.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }
        res.json(data);
    }
};