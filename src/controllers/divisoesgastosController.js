const helpers = require("../helpers");
const DivisaoGasto = require("../models/divisaogasto");

module.exports = class DivisoesGastos {
    constructor(application) {
        this.application = application;
    }

    index = async (req, res) => {
        if (req.method === "POST") {
            try {
                const data_inicio = req.body.data_inicio;
                const data_fim = req.body.data_fim;
                const pessoas = req.body.pessoas;
                const data = await DivisaoGasto.getData({ data_inicio, data_fim, pessoas });
                
                res.render("divisoesgastos/lista", {data});
            } catch (error) {
                helpers.handleError(res, error);
            }
            return;
        }

        helpers.template(this.application, res, "divisoesgastos/index");
    }
}