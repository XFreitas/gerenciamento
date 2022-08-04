const sequelize = require('../configs/db');
const {
    DataTypes, QueryTypes, Model
} = require('sequelize');

class MainModel extends Model {

    static formatNumber = (sqlField, casasDecimais = 2) => {
        const zeros = '0'.repeat(casasDecimais);

        return `replace(printf('%,3d', ${sqlField}), ',', '.') || ',' || case instr(${sqlField}, '.')` +
            `  when 0 then '${zeros}'` +
            `  else substr(substr(${sqlField}, instr(${sqlField}, '.') + 1, ${casasDecimais}) || '${zeros}', 1, ${casasDecimais}) end`
    };

    static formatDate = (sqlField) => `case strftime('%w', ${sqlField})` +
        `  when '0' then 'Dom'` +
        `  when '1' then 'Seg'` +
        `  when '2' then 'Ter'` +
        `  when '3' then 'Qua'` +
        `  when '4' then 'Qui'` +
        `  when '5' then 'Sex'` +
        `  when '6' then 'Sab'` +
        `  end` +
        `  ||` +
        `  strftime(' %d/%m/%Y', ${sqlField})`;

    static serverProcessing = async (params = {}) => {
        if (typeof params.where === 'undefined') {
            params.where = `\nwhere 1 = 1`;
        } else {
            if (params.where.indexOf('\n') == -1) {
                params.where = `\n${params.where}`;
            }
        }

        const whereModel = params.where;

        const auxSearchQuery = {};
        if ((params.searchQuery.length > 0 && params.searchQuery != 'null')) {
            const searchQueryCols = params.colsWhere
                .filter(e => e.length > 0)
                .map(col => (
                    params.searchQuery
                        .split(';')
                        .map((v, i) => `${col} LIKE :searchQuery${i}`)
                        .join(' OR ')
                ))
                .join(' OR ');

            params.where += `\n        AND (${searchQueryCols})`
            params.searchQuery.split(';').map((v, i) => {
                auxSearchQuery[`searchQuery${i}`] = `%${v}%`;
            });
        };

        const colsSearch = {}, auxColumnWhere = [];
        params.colsWhere.forEach((col, index) => {
            if (params[`columnsSearch${index}`]) {
                const searchC = [];
                params[`columnsSearch${index}`].split(';').map((v, i) => {
                    colsSearch[`columnsSearch${index}${i}`] = `%${v}%`;
                    searchC.push(`${col} LIKE :columnsSearch${index}${i}`);
                });
                auxColumnWhere.push(`(${searchC.join(' OR ')})`);
            }
        });
        console.log({ colsSearch, auxColumnWhere });
        if (auxColumnWhere.length > 0) {
            params.where += `\n        AND ${auxColumnWhere.map(col => `${col}`).join(' AND ')}`;
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
            params.where +
            `\n    ) AS foo` +
            `\n    GROUP BY ${params.priorityGroupColumn.split('.').slice(-1)}` +
            order +
            `\n    LIMIT ${params.length}` +
            `\n    OFFSET ${params.start}` +
            `\n) AS foo`, {
            type: QueryTypes.SELECT,
            replacements: {
                ...colsSearch,
                ...auxSearchQuery
            }
        }),
            recordsTotal = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join} ${whereModel}`, {
                type: QueryTypes.SELECT,
                replacements: {}
            }),
            recordsFiltered = await sequelize.query(`SELECT COUNT(${params.priorityGroupColumn}) AS count ${params.from_join} ${params.where}`, {
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
}

module.exports = { sequelize, MainModel };