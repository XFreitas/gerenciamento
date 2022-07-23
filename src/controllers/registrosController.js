const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

module.exports = class Registros {
    constructor(application) {
        this.application = application;
    }

    index = (req, res) => {
        require("../helpers").template(this.application, res, "registros/index", {});
    }

    upload = async (req, res) => res.render("registros/upload");

    doUpload = async (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, function (error, fields, file) {
            const filepath = file.upload.filepath;

            const data = fs.readFileSync(filepath, "utf8");

            const lines = data.split("\r\n");
            const registros = [];
            lines.forEach(line => {
                const registro = line.split(";");
                registros.push({
                    dataRegistro: registro[0],
                    valor: registro[1],
                    observacao: registro[2]
                });
            });

            res.send(registros);
        });
    }
};