'use strict';
module.exports = {
  /**
   * 
   * @param {import('sequelize/types').QueryInterface} queryInterface 
   * @param {import('sequelize/types').DataTypes} Sequelize 
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Registros', {
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
      conta: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Contas',
          },
          key: 'id'
        }
      },
      dataRegistro: {
        type: Sequelize.DATE
      },
      valor: {
        type: Sequelize.DECIMAL
      },
      observacao: {
        type: Sequelize.TEXT
      },
      divisao: {
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
    await queryInterface.dropTable('Registros');
  }
};