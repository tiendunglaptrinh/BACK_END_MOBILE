import { Sequelize, DataTypes } from '@sequelize/core';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Post = sequelize.define(
  'Post',
  {
    namePost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeRoom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deposit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bedroom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bathroom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comfort: {
      type: DataTypes.ENUM('TV', 'standard', 'luxury'),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User, 
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
  }
);

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

export default Post;
