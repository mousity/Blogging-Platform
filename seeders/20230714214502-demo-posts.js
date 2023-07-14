'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
    {
      body: "I'm the first one here!",
      userId: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I'm really good at making spaghetti",
      userId: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "My mom grounded me today. So uncool.",
      userId: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "Passed English with a C-. I'm so smart!",
      userId: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "Anybody have a wrench I can borrow?",
      userId: 3,
      created_at: new Date(),
      updated_at: new Date()
     }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {truncate: true, cascade: true});
  }
};
