'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Duplicatas', {
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
      data: {
        type: Sequelize.DATE
      },
      valor: {
        type: Sequelize.DECIMAL
      },
      valorpago: {
        type: Sequelize.DECIMAL
      },
      observacao: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Duplicatas');
  }
};