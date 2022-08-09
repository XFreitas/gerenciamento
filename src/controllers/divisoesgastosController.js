const helpers = require("../helpers");
const moment = require("moment");
const DivisaoGasto = require("../models/divisaogasto");

module.exports = class DivisoesGastos {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        if (req.method === "POST") {
            const data_inicio = moment(req.body.data_inicio, "DD/MM/YYYY").format("YYYY-MM-DD");
            const data_fim = moment(req.body.data_fim, "DD/MM/YYYY").format("YYYY-MM-DD");
            const pessoas = req.body.pessoas;
            DivisaoGasto.getData({ data_inicio, data_fim, pessoas })
                .then(data => {
                    console.log(data);
                    res.render("divisoesgastos/lista", data);
                })
                .catch(err => console.log(err));
            return;
        }

        helpers.template(this.application, res, "divisoesgastos/index");
    }
}