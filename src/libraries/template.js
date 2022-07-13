const fs = require('fs');

module.exports = function () {
    return function template(res, path, data) {
        return res.render("templates", { content: `../${path}`, data });
    }
}