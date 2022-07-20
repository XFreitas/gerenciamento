const sequelize = require('../configs/db');
const {
    DataTypes, QueryTypes, Model
} = require('sequelize');

class MainModel extends Model {
    static async serverProcessing() {
        const data = JSON.stringify(await sequelize.query(`SELECT ('[' || GROUP_CONCAT(row, ',') || ']') AS data` +
            `\nFROM (` +
            `\n    SELECT GROUP_CONCAT('['` +
            `\n        || '''' || id || ''','` +
            `\n        || '''' || nome || ''''` +
            `\n        || ']', ',') AS row` +
            `\n    FROM (` +
            `\n        SELECT id, nome` +
            `\n        FROM Pessoas` +
            `\n        LIMIT 1` +
            `\n        OFFSET 2` +
            `\n    ) AS foo` +
            `\n    GROUP BY id` +
            `\n) AS foo`, {
            type: QueryTypes.SELECT,
        }));
        console.log(data);
    }
}

module.exports = { sequelize, MainModel };