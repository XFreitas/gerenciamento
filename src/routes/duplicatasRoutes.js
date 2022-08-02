const Duplicatas = require("../controllers/duplicatasController");

const baseUri = function (uri) {
    if (uri) {
        return `/duplicatas/${uri}`;
    }
    return '/duplicatas';
};

module.exports = function (application) {
    const duplicatasController = new Duplicatas(application);

    application.get(baseUri(), function (req, res) {
        duplicatasController.index(req, res);
    });

    application.get(baseUri('create'), (req, res) => duplicatasController.showModal(req, res));
    application.get(baseUri('update'), (req, res) => duplicatasController.showModal(req, res));

    application.post(baseUri('upload'), (req, res) => duplicatasController.doUpload(req, res));

    application.post(baseUri('categorizar'), (req, res) => duplicatasController.categorizar(req, res));
    application.get(baseUri('categorizar'), (req, res) => duplicatasController.categorizar(req, res));

    application.get(baseUri('serverprocessing'), function (req, res) {
        duplicatasController.serverProcessing(req, res);
    });
};