'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Disbursements', {
      disbursement_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'Campaigns',
          },
          key: 'campaign_id'
        }
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected',"processing"),
      },
      request_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      processed_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Disbursements');
  }
};