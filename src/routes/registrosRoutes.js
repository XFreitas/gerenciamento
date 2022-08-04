const Registros = require("../controllers/registrosController");
const validate = require("../validations/registros");

const baseUri = function (uri) {
    if (uri) {
        return `/registros/${uri}`;
    }
    return '/registros';
};

module.exports = function (application) {
    const registrosController = new Registros(application);

    application.get(baseUri(), function (req, res) {
        registrosController.index(req, res);
    });

    application.get(baseUri('upload'), (req, res) => registrosController.upload(req, res));
    application.post(baseUri('upload'), (req, res) => registrosController.doUpload(req, res));

    application.get(baseUri('action'), (req, res) => registrosController.action(req, res));
    application.post(baseUri('action'), validate.acao, (req, res) => registrosController.action(req, res));

    application.get(baseUri('serverprocessing'), function (req, res) {
        registrosController.serverProcessing(req, res);
    });
};