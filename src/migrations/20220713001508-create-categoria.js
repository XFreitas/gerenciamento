'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoria: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Categorias',
          },
          key: 'id'
        }
      },
      nome: {
        type: Sequelize.STRING
      },
      nivel: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Categorias');
  }
};