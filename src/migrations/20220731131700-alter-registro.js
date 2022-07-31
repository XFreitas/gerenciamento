'use strict';

module.exports = {
  /**
   * 
   * @param {import('sequelize/types').QueryInterface} queryInterface 
   * @param {import('sequelize/types').DataTypes} Sequelize 
   */
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Registros', 'duplicata', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Duplicatas',
        },
        key: 'id'
      },
    });
  },

  /**
   * 
   * @param {import('sequelize/types').QueryInterface} queryInterface 
   * @param {import('sequelize/types').DataTypes} Sequelize 
   */
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Registros', 'duplicata');
  }
};
