'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [
    {
      body: "I'm also the first to comment on stuff!",
      user_id: 1,
      post_id: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I bet your spaghetti tastes like cardboard!!!",
      user_id: 2,
      post_id: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "What brand of sauce did you use?",
      user_id: 3,
      post_id: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I don't.",
      user_id: 1,
      post_id: 5,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "It's okay, I'll use a screwdriver. They're basically the same thing",
      user_id: 3,
      post_id: 5,
      created_at: new Date(),
      updated_at: new Date()
     }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
