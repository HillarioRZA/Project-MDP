'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Donations', [
      {
        donation_id: 'DON001',
        user_id: 'US001',
        campaign_id: 'CAM002',
        is_anonymous: false,
        amount: 30000,
        status: 'success',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        donation_id: 'DON002',
        user_id: 'US002',
        campaign_id: 'CAM002',
        is_anonymous: true,
        amount: 30000,
        status: 'success',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        donation_id: 'DON003',
        user_id: 'US004',
        campaign_id: 'CAM003',
        is_anonymous: true,
        amount: 100000,
        status: 'success',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Donations', null, {});
  }
};
