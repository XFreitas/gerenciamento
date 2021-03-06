const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const Conta = require("../models/conta");
const Pessoa = require("../models/pessoa");
const Categoria = require("../models/categoria");
const Registro = require("../models/registro");

module.exports = class Registros {
    constructor(application) {
        this.application = application;
    }

    index = async (req, res) => {
        const data = {};
        const contas = await Conta.findAll();

        data.contas = [];

        for (let index = 0; index < contas.length; index++) {
            const conta = contas[index];
            const pessoa = await Pessoa.findByPk(conta.pessoa);

            data.contas.push({
                value: conta.id,
                text: `${pessoa.nome}: ${conta.nome_banco} - ${conta.numero}`,
            });
        }

        require("../helpers").template(this.application, res, "registros/index", data);
    }

    upload = async (req, res) => {
        const data = {};
        const contas = await Conta.findAll();

        data.contas = contas.map(conta => ({
            value: conta.id,
            text: `${conta.nome_banco} - ${conta.numero}`,
        }));

        console.log(data);
        res.render("registros/upload", data);
    };

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
                    data: registro[0],
                    valor: registro[1],
                    observacao: registro[2]
                });
            });

            registros.forEach(async registro => {
                await Registro.create({
                    categoria: null,
                    conta: fields.conta,
                    dataRegistro: registro.data,
                    valor: registro.valor,
                    observacao: registro.observacao.trim().toUpperCase(),
                });
            });

            res.send({ total: registros.length });
        });
    }

    categorizar = async (req, res) => {
        const data = {};

        if (req.method === "POST") {
            await Registro.update({
                categoria: req.body.categoria,
            }, {
                where: {
                    id: req.body.id,
                }
            });

            res.send({ success: true });
            return;
        }

        const categorias = await Categoria.findAll();
        data.id = req.query.id;

        data.categorias = [{
            value: '',
            text: "Selecione..."
        }];

        for (let index = 0; index < categorias.length; index++) {
            const categoria = categorias[index];
            data.categorias.push({
                value: categoria.id,
                text: categoria.nome,
            });
        }

        console.log(data);
        res.render("registros/categorizar", data);
    };

    serverProcessing = async (req, res) => {
        let data = {};
        try {
            data = await Registro.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
};