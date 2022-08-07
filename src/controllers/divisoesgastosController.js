const helpers = require("../helpers");

module.exports = class DivisoesGastos {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        helpers.template(this.application, res, "divisoesgastos/index");
    }
}