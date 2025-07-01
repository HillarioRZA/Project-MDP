const db = require("../models");

module.exports = {
    getAll: async function(req, res) {
        try {
            let queryOptions = {};
            let campaigns;
            const userId = req.user.userId
            console.log(userId)
            if (req.user.role === 'donatur') {
                queryOptions.where = { status: 'active' };
            } 
            else if(req.user.role === 'fundraiser'){
                queryOptions.where = { user_id: req.user.userId };

            }
            queryOptions.include = [{
                model: db.User,
                // Kita hanya butuh beberapa atribut, tidak perlu semua (termasuk password)
                attributes: ['user_id', 'firstName', 'lastName'] 
            }];
            campaigns = await db.Campaign.findAll(queryOptions);
            return res.status(200).json(campaigns);
        } catch (err) {
            return res.status(500).json({ message: "Gagal mengambil data campaign", error: err.message });
        }
    },
    getById: async function(req, res) {
        try {
            const { id } = req.params;
            const campaign = await db.Campaign.findOne({
                where: { campaign_id: id },
                include: [{
                    model: db.User,
                    attributes: ['user_id', 'firstName', 'lastName']
                }, { model: db.Disbursement }]
            });
            if (!campaign) return res.status(404).json({ message: "Campaign tidak ditemukan" });
            if (req.user.role === 'donatur' && campaign.status !== 'active') {
                return res.status(403).json({ message: "Campaign tidak ditemukan" });
            }
            return res.status(200).json(campaign);
        } catch (err) {
            return res.status(500).json({ message: "Gagal mengambil data campaign", error: err.message });
        }
    },
    create: async function(req, res) {
        try {
            // Hanya fundraiser yang bisa akses, sudah dicek di middleware
            const { title, description, targetAmount } = req.body;
            
            // Cek apakah ada file gambar yang diupload
            if (!req.file) {
                return res.status(400).json({ message: "Gambar campaign wajib diupload" });
            }

            // Cari campaignId terakhir
            const lastCampaign = await db.Campaign.findOne({ order: [["campaign_id", "DESC"]] });
    
            let newIdNumber = 1;
            if (lastCampaign) {
                const lastIdNumber = parseInt(lastCampaign.campaign_id.substring(3));
                newIdNumber = lastIdNumber + 1;
            }
            const campaignId = `CAM${String(newIdNumber).padStart(3, '0')}`;
            
            // Simpan path gambar
            const imageUrl = req.file.path;
            
            const Newcampaign = await db.Campaign.create({
                campaign_id: campaignId,
                user_id: req.user.userId,
                title,
                description,
                image_url: imageUrl,
                target_amount: targetAmount,
                current_amount: 0,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const createdCampaignWithUser = await db.Campaign.findOne({
                where: { campaign_id: campaignId },
                include: [{
                    model: db.User,
                    attributes: ['user_id', 'firstName', 'lastName']
                }]
            });
            // --- SELESAI DIPERBAIKI ---
        
            return res.status(201).json(createdCampaignWithUser); 
        } catch (err) {
            return res.status(500).json({ message: "Gagal membuat campaign", error: err.message });
        }
    },
    setStatus: async function(req, res) {
        try {
            // Hanya admin yang bisa akses, sudah dicek di middleware
            const { id } = req.params;
            const { status } = req.body;
            const campaign = await db.Campaign.findOne({ where: { campaign_id: id } });
            if (!campaign) return res.status(404).json({ message: "Campaign tidak ditemukan" });
            campaign.status = status;
            if (status === 'cancelled') {
                campaign.deletedAt = new Date();
            }
            await campaign.save();
            return res.status(200).json({ message: "Status campaign berhasil diupdate", campaign });
        } catch (err) {
            return res.status(500).json({ message: "Gagal update status campaign", error: err.message });
        }
    },
    requestDisbursement: async function(req, res) {
        try {
            const { id } = req.params; // campaignId
            const { amount } = req.body;
            // Pastikan campaign milik fundraiser yang login
            const campaign = await db.Campaign.findOne({ where: { campaign_id: id, user_id: req.user.userId } });
            if (!campaign) return res.status(404).json({ message: "Campaign tidak ditemukan atau bukan milik Anda" });
            if (amount > campaign.current_amount) {
                return res.status(400).json({ message: "Dana tidak mencukupi" });
            }
            // Generate disbursementId
            const lastDisb = await db.Disbursement.findOne({ order: [["disbursement_id", "DESC"]] });
            let newIdNumber = 1;
            if (lastDisb) {
                const lastIdNumber = parseInt(lastDisb.disbursement_id.substring(3));
                newIdNumber = lastIdNumber + 1;
            }
            const disbursementId = `DIS${String(newIdNumber).padStart(3, '0')}`;
            console.log(disbursementId)
            const disbursement = await db.Disbursement.create({
                disbursement_id:disbursementId,
                campaign_id: id,
                amount,
                status: 'pending',
                request_at: new Date(),
            });
            return res.status(201).json(disbursement);
        } catch (err) {
            return res.status(500).json({ message: "Gagal mengajukan pencairan dana", error: err.message });
        }
    },
    verifyDisbursement: async function(req, res) {
        try {
            const { id } = req.params; // disbursementId
            const { status } = req.body; // approved/rejected/processing
            const disbursement = await db.Disbursement.findOne({ where: { disbursement_id: id } });
            if (!disbursement) return res.status(404).json({ message: "Disbursement tidak ditemukan" });
            disbursement.status = status;
            if (status === 'approved' || status === 'rejected') {
                disbursement.processed_at = new Date();
            }
            await disbursement.save();
            return res.status(200).json({ message: "Status disbursement berhasil diupdate", disbursement });
        } catch (err) {
            return res.status(500).json({ message: "Gagal verifikasi disbursement", error: err.message });
        }
    },
    getAllDisbursements: async function(req, res) {
        try {
            let queryOptions = {}; // Siapkan objek query kosong

        // Cek peran pengguna yang login dari token
        if (req.user.role === 'admin') {
            // JIKA ADMIN: Ambil semua disbursement yang statusnya 'pending'
            queryOptions.where = { status: 'pending' };
            queryOptions.include = [ // Sertakan detail campaign dan user pembuatnya
                {
                    model: db.Campaign,
                    attributes: ['title'],
                    include: [{
                        model: db.User,
                        attributes: ['firstName', 'lastName']
                    }]
                }
            ];
            queryOptions.order = [['request_at', 'ASC']]; // Tampilkan yang paling lama dulu

        } else if (req.user.role === 'fundraiser') {
            // JIKA FUNDRAISER: Ambil semua disbursement dari campaign milik fundraiser tsb
            const userCampaigns = await db.Campaign.findAll({
                where: { user_id: req.user.userId },
                attributes: ['campaign_id'],
            });
            const userCampaignIds = userCampaigns.map(c => c.campaign_id);

            queryOptions.where = { campaign_id: userCampaignIds };
            queryOptions.include = [{ model: db.Campaign, attributes: ['title'] }]; // Cukup sertakan judul campaign
            queryOptions.order = [['request_at', 'DESC']]; // Tampilkan yang terbaru dulu

        }
        
        const disbursements = await db.Disbursement.findAll(queryOptions);
        return res.status(200).json(disbursements);
        } catch (err) {
            return res.status(500).json({ message: "Gagal mengambil data disbursement", error: err.message });
        }
    }
}
