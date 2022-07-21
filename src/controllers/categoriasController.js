const CategoriaModel = require("../models/categoria");

module.exports = class Categorias {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        require("../helpers").template(this.application, res, "categorias/index", {});
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