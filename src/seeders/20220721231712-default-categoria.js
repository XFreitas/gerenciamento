'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categorias', [
      "RECEITA",
      "DESPESA",
      "DOAÇÕES",
      "INVESTIMENTOS",
      "TRANSFERÊNCIA ENTRE CONTAS",
      "DIVISÃO DE GASTOS",
      "LANÇAMENTOS FUTUROS",
    ].map((nome,i)=>({
      id: i+1,
      nome,
      nivel:0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })), {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categorias', null, {});
  }
};
