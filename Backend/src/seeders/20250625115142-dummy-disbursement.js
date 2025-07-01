'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Disbursements', [
      {
        disbursement_id: 'DIS001',
        campaign_id: 'CAM003',
        amount: 100000,
        status: 'approved',
        request_at: new Date(),
        processed_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disbursements', null, {});
  }
};
