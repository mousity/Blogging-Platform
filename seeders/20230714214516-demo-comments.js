'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [
    {
      body: "I'm also the first to comment on stuff!",
      userId: 1,
      postId: 1,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I bet your spaghetti tastes like cardboard!!!",
      userId: 2,
      postId: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "What brand of sauce did you use?",
      userId: 3,
      postId: 2,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "I don't.",
      userId: 1,
      postId: 5,
      created_at: new Date(),
      updated_at: new Date()
     },{
      body: "It's okay, I'll use a screwdriver. They're basically the same thing",
      userId: 3,
      postId: 5,
      created_at: new Date(),
      updated_at: new Date()
     }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {truncate: true, cascade: true});
  }
};
