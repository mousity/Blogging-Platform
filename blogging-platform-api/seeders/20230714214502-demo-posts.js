'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
    {
      body: "I'm the first one here!",
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I'm really good at making spaghetti",
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "My mom grounded me today. So uncool.",
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "Passed English with a C-. I'm so smart!",
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "Anybody have a wrench I can borrow?",
      user_id: 3,
      created_at: new Date(),
      updated_at: new Date()
     }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
