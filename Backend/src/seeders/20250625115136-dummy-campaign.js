'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Campaigns', [
      {
        campaign_id: 'CAM001',
        user_id: 'US003',
        title: 'Campaign 1',
        description: 'Campaign 1 description',
        image_url: 'https://via.placeholder.com/150',
        target_amount: 1000000,
        current_amount: 0,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        campaign_id: 'CAM002',
        user_id: 'US003',
        title: 'Campaign 2',
        description: 'Campaign 2 description',
        image_url: 'https://via.placeholder.com/150',
        target_amount: 1000000,
        current_amount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        campaign_id: 'CAM003',
        user_id: 'US003',
        title: 'Campaign 3',
        description: 'Campaign 3 description',
        image_url: 'https://via.placeholder.com/150',
        target_amount: 1000000,
        current_amount: 1000000,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Campaigns', null, {});
  }
};
