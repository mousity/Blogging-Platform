'use strict';
const {
  Model
} = require('sequelize');
const { User, Post } = require("./user.js");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Post, { foreignKey: "postId"});
      this.belongsTo(models.User, { foreignKey: "userId"});
    }
  }
  Comment.init({
    body: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments'
  });
  return Comment;
};