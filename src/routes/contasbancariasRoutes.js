const ContasBancarias = require("../controllers/contasbancariasController");
const validate = require("../validations/contasbancarias");

const baseUri = function (uri) {
    if (uri) {
        return `/contasbancarias/${uri}`;
    }
    return '/contasbancarias';
};

module.exports = function (application) {
    const contasBancariasController = new ContasBancarias(application);

    application.get(baseUri(), function (req, res) {
        contasBancariasController.index(req, res);
    });

    application.get(baseUri('create'), function (req, res) {
        contasBancariasController.showmodal(req, res);
    });

    application.get(baseUri('update'), function (req, res) {
        contasBancariasController.showmodal(req, res);
    });

    application.post(baseUri('create'), validate.create, contasBancariasController.create);
}