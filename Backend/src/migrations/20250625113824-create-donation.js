'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
      donation_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'user_id'
        }
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
      is_anonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    },{
      primaryKey: 'donation_id'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Donations');
  }
};