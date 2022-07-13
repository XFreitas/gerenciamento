const newsController = require('../controllers/news');

module.exports = function (application) {
    application.get('/', function (req, res) {
        newsController.index(application, req, res);
    });
}