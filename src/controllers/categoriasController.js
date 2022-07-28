const { Op } = require("sequelize");
const CategoriaModel = require("../models/categoria");

module.exports = class Categorias {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        require("../helpers").template(this.application, res, "categorias/index", {});
    }

    createupdate = async (req, res) => {
        const data = {
            categoria: null
        };
        try {
            if (Object.keys(req.body).length > 0) {
                let categoria;
                const nivelPai = await CategoriaModel.findOne({ where: { id: req.body.categoria } });
                if (req.body.id) {
                    categoria = await CategoriaModel.update({ categoria: req.body.categoria, nome: req.body.nome, nivel: nivelPai.nivel + 1 }, { where: { id: req.body.id } });
                } else {
                    categoria = await CategoriaModel.create({ categoria: req.body.categoria, nome: req.body.nome, nivel: nivelPai.nivel + 1 });
                }
                res.status(200).send({ id: categoria.id });
                return;
            }

            const where = {};
            if (req.query.id) {
                const id = req.query.id;
                data.categoria = await CategoriaModel.findByPk(id);
                where.id = { [Op.ne]: id };
            }

            const categorias = await CategoriaModel.findAll({
                attributes: ["id", ["(nivel || ' - ' || nome)", "nome"], "nivel"],
                order: [["nome", "ASC"]],
                where
            });
            data.categorias = [{ value: '', text: 'Selecione uma categoria' }];
            if (!data.categoria) {
                data.niveis = [{ value: '', text: 'Selecione um Nível' }];
            }
            categorias.forEach(categoria => {
                data.categorias.push({
                    value: categoria.id,
                    text: categoria.nome,
                });

                if (!data.categoria && data.niveis.findIndex(nivel => nivel.value === categoria.nivel) === -1) {
                    data.niveis.push({
                        value: categoria.nivel,
                        text: `Nivel ${categoria.nivel}`,
                    });
                }
            });
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        /* console.log(data); */
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