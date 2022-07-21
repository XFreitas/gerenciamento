const sequelize = require('../configs/db');
const {
    DataTypes, QueryTypes, Model
} = require('sequelize');

class MainModel extends Model {
    static serverProcessing = async (params = {}) => {
        const where = (params.searchQuery.length > 0 && params.searchQuery != 'null' ? `\n        AND (${params.colsWhere.map(col => `${col} LIKE :searchQuery`).join(' OR ')})` : '');
        const data = await sequelize.query(`SELECT ('[' || GROUP_CONCAT(row, ',') || ']') AS data` +
            `\nFROM (` +
            `\n    SELECT GROUP_CONCAT('['` +
            `\n        || '"' || ${params.columns.join(` || '",'|| '"' || `)} || '"'` +
            `\n        || ']', ',') AS row` +
            `\n    FROM (` +
            `\n        ${params.select}` +
            `\n        ${params.from_join}` +
            `\n        WHERE 1=1` +
            where +
            `\n        LIMIT ${params.length}` +
            `\n        OFFSET ${params.start}` +
            `\n    ) AS foo` +
            `\n    GROUP BY ${params.priorityGroupColumn}` +
            (typeof params.colsOrder[params.sortColumn] != "undefined"
                ? `\n    ORDER BY ${params.colsOrder[params.sortColumn]}${["asc", "desc"].indexOf(params.sortDirection) > -1 ? ` ${params.sortDirection}` : ''}`
                : '') +
            `\n) AS foo`, {
            type: QueryTypes.SELECT,
            replacements: {
                searchQuery: `%${params.searchQuery}%`,
            }
        }),
            recordsTotal = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join}`, {
                type: QueryTypes.SELECT,
                replacements: {
                    searchQuery: `%${params.searchQuery}%`,
                }
            }),
            recordsFiltered = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join} WHERE 1=1${where}`, {
                type: QueryTypes.SELECT,
                replacements: {
                    searchQuery: `%${params.searchQuery}%`,
                }
            });

        return {
            data: (typeof data[0] !== 'undefined' && data[0].data != null ? JSON.parse(data[0].data) : []),
            recordsTotal: (typeof recordsTotal[0] !== 'undefined' ? recordsTotal[0].count : 0),
            recordsFiltered: (typeof recordsFiltered[0] !== 'undefined' ? recordsFiltered[0].count : 0),
        };
    };
    // console.log(data);
}

module.exports = { sequelize, MainModel };