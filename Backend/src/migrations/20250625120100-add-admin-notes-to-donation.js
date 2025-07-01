'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Donations', 'admin_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Catatan admin saat verifikasi'
    });

    await queryInterface.addColumn('Donations', 'verified_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Waktu verifikasi oleh admin'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Donations', 'admin_notes');
    await queryInterface.removeColumn('Donations', 'verified_at');
  }
}; 