'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Campaign.belongsTo(models.User, { foreignKey: 'user_id' });
      Campaign.hasMany(models.Disbursement, { foreignKey: 'campaign_id' });
    }
  }
  Campaign.init({
    campaign_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    target_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_amount: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};