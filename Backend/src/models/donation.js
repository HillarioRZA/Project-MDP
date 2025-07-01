'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Donation.belongsTo(models.User, { foreignKey: 'user_id' });
      Donation.belongsTo(models.Campaign, { foreignKey: 'campaign_id' });
    }
  }
  Donation.init({
    donation_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaign_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
    },
    bukti_transaksi: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL atau path file bukti transaksi'
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Catatan admin saat verifikasi'
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Waktu verifikasi oleh admin'
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
    modelName: 'Donation',
  });
  return Donation;
};