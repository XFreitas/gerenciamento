'use strict';
const {
    Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class DivisaoGasto extends MainModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }

    static getData = async (params) => {
        
    }
}

DivisaoGasto.init({}, { sequelize });

module.exports = DivisaoGasto;