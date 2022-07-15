const { template } = require("../helpers")

class ContasBancarias {
    constructor(application) {
        this.application = application;
    }

    index(req, res) {
        template(this.application, res, "contasbancarias/index", {});
    }

    create(req, res) {
        res.render("contasbancarias/createUpdate", {});
    }
}

module.exports = ContasBancarias;