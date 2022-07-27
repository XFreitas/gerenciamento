const sequelize = require('../configs/db');
const {
    DataTypes, QueryTypes, Model
} = require('sequelize');

class MainModel extends Model {
    static serverProcessing = async (params = {}) => {
        let where = ``;
        const auxSearchQuery = {};
        if ((params.searchQuery.length > 0 && params.searchQuery != 'null')) {
            where += `\n        AND (${params.colsWhere.map(col => (params.searchQuery.split(';').map((v, i) => `${col} LIKE :searchQuery${i}`).join(' OR '))).join(' OR ')})`
            params.searchQuery.split(';').map((v, i) => {
                auxSearchQuery[`searchQuery${i}`] = `%${v}%`;
            });
        };

        const colsSearch = {}, auxColumnWhere = [];
        params.colsWhere.forEach((col, index) => {
            if (params[`columnsSearch${index}`]) {
                let searchC = [];
                params[`columnsSearch${index}`].split(';').map((v, i) => {
                    colsSearch[`columnsSearch${index}${i}`] = `%${v}%`;
                    searchC.push(`${col} LIKE :columnsSearch${index}${i}`);
                });
                auxColumnWhere.push(`(${searchC.join(' OR ')})`);
            }
        });
        console.log({ colsSearch, auxColumnWhere });
        if (auxColumnWhere.length > 0) {
            where += `\n        AND ${auxColumnWhere.map(col => `${col}`).join(' AND ')}`;
        }

        let order = ``;
        if (typeof params.colsOrder[params.sortColumn] != "undefined") {
            order = `\n    ORDER BY ${params.colsOrder[params.sortColumn]}${["asc", "desc"].indexOf(params.sortDirection) > -1 ? ` ${params.sortDirection}` : ''}`
        }

        const data = await sequelize.query(`SELECT ('[' || GROUP_CONCAT(row, ',') || ']') AS data` +
            `\nFROM (` +
            `\n    SELECT GROUP_CONCAT('['` +
            `\n        || '"' || COALESCE(${params.columns.join(`, '') || '",'|| '"' || COALESCE(`)}, '') || '"'` +
            `\n        || ']', ',') AS row` +
            `\n    FROM (` +
            `\n        ${params.select}` +
            `\n        ${params.from_join}` +
            `\n    WHERE 1=1` +
            where +
            order +
            `\n        LIMIT ${params.length}` +
            `\n        OFFSET ${params.start}` +
            `\n    ) AS foo` +
            `\n    GROUP BY ${params.priorityGroupColumn.split('.').slice(-1)}` +
            `\n) AS foo`, {
            type: QueryTypes.SELECT,
            replacements: {
                ...colsSearch,
                ...auxSearchQuery
            }
        }),
            recordsTotal = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join}`, {
                type: QueryTypes.SELECT,
                replacements: {}
            }),
            recordsFiltered = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join} WHERE 1=1${where}`, {
                type: QueryTypes.SELECT,
                replacements: {
                    ...colsSearch,
                    ...auxSearchQuery
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