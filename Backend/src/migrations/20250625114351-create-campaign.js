'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      campaign_id: {
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
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      target_amount: {
        type: Sequelize.INTEGER,
      },
      current_amount: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'completed', 'cancelled'),
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
      primaryKey: 'campaign_id'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns');
  }
};