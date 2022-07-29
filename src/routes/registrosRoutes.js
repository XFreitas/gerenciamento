const Registros = require("../controllers/registrosController");

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

    application.post(baseUri('categorizar'), (req, res) => registrosController.categorizar(req, res));
    application.get(baseUri('categorizar'), (req, res) => registrosController.categorizar(req, res));

    application.get(baseUri('serverprocessing'), function (req, res) {
        registrosController.serverProcessing(req, res);
    });
};