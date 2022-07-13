'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tipocontas', [
      {
        id: 1,
        nome: 'Conta bancaria',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nome: 'Carteira',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Tipocontas', null, {});
  }
};
