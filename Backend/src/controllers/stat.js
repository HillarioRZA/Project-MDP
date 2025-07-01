const { User, Campaign } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // Hitung total fundraisers
    const totalFundraisers = await User.count({
      where: {
        role: 'fundraiser',
        deletedAt: null
      }
    });

    // Hitung campaign aktif
    const activeCampaigns = await Campaign.count({
      where: {
        status: 'active',
        deletedAt: null
      }
    });

    // Hitung campaign selesai
    const completedCampaigns = await Campaign.count({
      where: {
        status: 'completed',
        deletedAt: null
      }
    });

    res.json({
      success: true,
      data: {
        totalFundraisers,
        activeCampaigns,
        completedCampaigns,
      }
    });

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
