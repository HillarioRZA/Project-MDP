'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disbursement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Disbursement.belongsTo(models.Campaign, { foreignKey: 'campaign_id' });
    }
  }
  Disbursement.init({
    disbursement_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    campaign_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected',"processing"),
    },
    request_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    processed_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Disbursement',
    timestamps: false,
  });
  return Disbursement;
};