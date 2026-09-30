'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('similar_products', { id: {type: Sequelize.INTEGER, allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    productDetailId: {
      type: Sequelize.INTEGER,
    },
    color: {
      type: Sequelize.STRING,
    },
    hexCode: {
      type: Sequelize.STRING,
    },
    createdTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    createdBy: {
      type: Sequelize.INTEGER,
    }});


  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('similar_products');

  }
};
