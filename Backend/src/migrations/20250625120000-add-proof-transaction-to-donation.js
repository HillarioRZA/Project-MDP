'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Donations', 'bukti_transaksi', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL atau path file bukti transaksi'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Donations', 'bukti_transaksi');
  }
}; 