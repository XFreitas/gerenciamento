const Duplicatas = require("../controllers/duplicatasController");
const validate = require('../validations/duplicatas');

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
    application.post(baseUri('create'), validate.createUpdate, (req, res) => duplicatasController.create(req, res));

    application.get(baseUri('update'), (req, res) => duplicatasController.showModal(req, res));
    application.put(baseUri('update'), validate.createUpdate, (req, res) => duplicatasController.update(req, res));
    
    application.get(baseUri('pagar'), (req, res) => duplicatasController.showModalPagar(req, res));
    
    application.get(baseUri('serverprocessing'), function (req, res) {
        duplicatasController.serverProcessing(req, res);
    });

    application.get(baseUri('serverprocessingregistros'), function (req, res) {
        duplicatasController.serverProcessingRegistros(req, res);
    });
};