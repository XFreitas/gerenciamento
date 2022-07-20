'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipoconta: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Tipocontas',
          },
          key: 'id'
        }
      },
      pessoa: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Pessoas',
          },
          key: 'id'
        }
      },
      numero: {
        type: Sequelize.TEXT
      },
      descricao: {
        type: Sequelize.TEXT
      },
      codigo_banco: {
        type: Sequelize.TEXT
      },
      nome_banco: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contas');
  }
};