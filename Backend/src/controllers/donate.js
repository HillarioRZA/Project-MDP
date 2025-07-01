const db = require("../models");
const sequelize = require("sequelize");

async function createDonation(req, res) {
    const t = await db.sequelize.transaction();
    try {
        const { campaignId, amount, isAnonymous } = req.body;
        const userId = req.user.userId;
        
        // Cek apakah ada file bukti transaksi
        if (!req.file) {
            await t.rollback();
            return res.status(400).json({ message: "Bukti transaksi wajib diupload" });
        }

        // Cek campaign
        const campaign = await db.Campaign.findOne({ where: { campaign_id:campaignId } });
        if (!campaign) {
            await t.rollback();
            return res.status(404).json({ message: "Campaign tidak ditemukan" });
        }
        if (campaign.status !== 'active') {
            await t.rollback();
            return res.status(400).json({ message: "Campaign tidak aktif" });
        }

        // Generate donationId
        const lastDonation = await db.Donation.findOne({ order: [["donation_id", "DESC"]] });
        let newIdNumber = 1;
        if (lastDonation) {
            const lastIdNumber = parseInt(lastDonation.donation_id.substring(3));
            newIdNumber = lastIdNumber + 1;
        }
        const donationId = `DON${String(newIdNumber).padStart(3, '0')}`;

        // Simpan path file bukti transaksi
        const buktiTransaksiPath = req.file.path;

        // Buat donasi dengan status pending untuk verifikasi admin
        const donation = await db.Donation.create({
            donation_id:donationId,
            user_id:userId,
            campaign_id:campaignId,
            amount,
            is_anonymous: isAnonymous || false,
            status: 'pending', // Status pending untuk verifikasi admin
            bukti_transaksi: buktiTransaksiPath,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, { transaction: t });

        // Note: currentAmount campaign tidak diupdate sampai admin verifikasi

        await t.commit();
        return res.status(201).json({
            message: "Donasi berhasil dibuat dan menunggu verifikasi admin",
            donation: donation
        });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ message: "Gagal membuat donasi", error: err.message });
    }
}

async function getDonationHistory(req, res) {
    try {
        const userId = req.user.userId;
        const donations = await db.Donation.findAll({ 
            where: { user_id: userId },
            // TAMBAHKAN INCLUDE INI
            include: [{
                model: db.Campaign,
                attributes: ['title'] // Cukup ambil judulnya
            }],
            order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
        });
        return res.status(200).json(donations);
    } catch (err) {
        return res.status(500).json({ message: "Gagal mengambil riwayat donasi", error: err.message });
    }
}

async function getDonationsByCampaign(req, res) {
    try {
        const { id } = req.params; // campaign_id
        const donations = await db.Donation.findAll({
            where: { campaign_id: id },
            include: [{
                model: db.User,
                attributes: ['firstName', 'lastName']
            }],
            order: [['createdAt', 'DESC']]
        });

        const formattedDonations = donations.map(d => ({
            nama_donatur: d.is_anonymous ? 'Anonim' : `${d.User.firstName} ${d.User.lastName}`,
            jumlah: d.amount,
            waktu_donasi: d.createdAt
        }));

        return res.status(200).json(formattedDonations);
    } catch (err) {
        return res.status(500).json({ message: "Gagal mengambil data donasi campaign", error: err.message });
    }
}

async function verifyDonation(req, res) {
    const t = await db.sequelize.transaction();
    try {
        const { donationId } = req.params;
        const { status, adminNotes } = req.body; // status: 'success' atau 'failed'

        // Cek donasi
        const donation = await db.Donation.findOne({ 
            where: { donation_id: donationId },
            include: [{ model: db.Campaign }]
        });

        if (!donation) {
            await t.rollback();
            return res.status(404).json({ message: "Donasi tidak ditemukan" });
        }

        if (donation.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({ message: "Donasi sudah diverifikasi" });
        }

        // Update status donasi
        donation.status = status;
        donation.admin_notes = adminNotes;
        donation.verified_at = new Date();
        await donation.save({ transaction: t });

        // Jika verifikasi berhasil, update currentAmount campaign
        if (status === 'success') {
            const campaign = donation.Campaign;
            campaign.current_amount = campaign.current_amount + donation.amount;
            await campaign.save({ transaction: t });
        }

        await t.commit();
        return res.status(200).json({
            message: `Donasi berhasil ${status === 'success' ? 'diverifikasi' : 'ditolak'}`,
            donation: donation
        });
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ message: "Gagal verifikasi donasi", error: err.message });
    }
}

async function getPendingDonations(req, res) {
    try {
        const donations = await db.Donation.findAll({
            where: { status: 'pending' },
            include: [
                { model: db.User, attributes: ['firstName', 'lastName', 'email'] },
                { model: db.Campaign, attributes: ['title', 'campaign_id'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedDonations = donations.map(d => ({
            donation_id: d.donation_id,
            nama_donatur: d.is_anonymous ? 'Anonim' : `${d.User.firstName} ${d.User.lastName}`,
            email_donatur: d.User.email,
            campaign_title: d.Campaign.title,
            campaign_id: d.Campaign.campaign_id,
            jumlah: d.amount,
            bukti_transaksi: d.bukti_transaksi,
            waktu_donasi: d.createdAt,
            status: d.status
        }));

        return res.status(200).json(formattedDonations);
    } catch (err) {
        return res.status(500).json({ message: "Gagal mengambil data donasi pending", error: err.message });
    }
}

module.exports = {
    createDonation,
    getDonationHistory,
    getDonationsByCampaign,
    verifyDonation,
    getPendingDonations,
};
