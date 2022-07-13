const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/database.sqlite'
});

(async () => {  
  try {
    await sequelize.sync();
    console.log('Database created');
  } catch (error) {
    console.log('Database error');
    console.log(error);
  }
})();

module.exports = sequelize;