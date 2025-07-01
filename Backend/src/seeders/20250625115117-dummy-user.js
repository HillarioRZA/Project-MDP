'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        user_id: 'US001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy',
        role: 'donatur',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'US002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: '$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy',
        role: 'donatur',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'US003',
        firstName: 'Jim',
        lastName: 'Beam',
        email: 'jim.beam@example.com',
        password: '$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy',
        role: 'fundraiser',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'US004',
        firstName: 'Sarah',
        lastName: 'Mccarthy',
        email: 'sarah.mccarthy@example.com',
        password: '$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy',
        role: 'donatur',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'US005',
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: '$2a$12$Zw3PoeCK/gAE7fTliVG8BuuTWhiaJjtOGykJdLF1PuOr4qK9seOyy',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
