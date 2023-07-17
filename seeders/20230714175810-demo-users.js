'use strict';
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      name: "User1",
      email: "example1@user.com",
      password: await bcrypt.hash("password", 10),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "User2",
      email: "example2@user.com",
      password: await bcrypt.hash("password", 10),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "User3",
      email: "example3@user.com",
      password: await bcrypt.hash("password", 10),
      created_at: new Date(),
      updated_at: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {truncate: true, cascade: true});
  }
};
