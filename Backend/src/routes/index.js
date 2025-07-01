const express = require("express");
const router = express.Router();
const path = require("path");

const { test, testAuth } = require("../controllers/sample");
const userController = require("../controllers/user");
const campaignController = require("../controllers/campaign");
const donationController = require("../controllers/donate");
const statController = require("../controllers/stat");
const auth = require("../middlewares/auth");
const { isFundraiser, isAdmin, isDonatur } = require("../middlewares/auth");
const { upload, uploadCampaignImage, handleUploadError } = require("../middlewares/upload");

router.get("/test", test);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/test-auth", auth, testAuth);

// Campaign routes
router.get("/campaigns", auth, campaignController.getAll);
router.get("/campaigns/:id", auth, campaignController.getById);
router.post("/campaigns", auth, isFundraiser, uploadCampaignImage.single('campaign_images'), handleUploadError, campaignController.create);
router.patch("/campaigns/:id/status", auth, isAdmin, campaignController.setStatus);
router.post("/campaigns/:id/disbursements", auth, isFundraiser, campaignController.requestDisbursement);
router.patch("/disbursements/:id/verify", auth, isAdmin, campaignController.verifyDisbursement);
router.get("/disbursements", auth, campaignController.getAllDisbursements);

// Donation routes
router.post("/donations", auth, isDonatur, upload.single('bukti_transaksi'), handleUploadError, donationController.createDonation);
router.get("/users/me/donations", auth, donationController.getDonationHistory);
router.get("/campaigns/:id/donations", auth, donationController.getDonationsByCampaign);

// Admin routes untuk verifikasi donasi
router.get("/admin/donations/pending", auth, isAdmin, donationController.getPendingDonations);
router.patch("/admin/donations/:donationId/verify", auth, isAdmin, donationController.verifyDonation);

// Admin dashboard stats
router.get("/admin/dashboard/stats", auth, isAdmin, statController.getDashboardStats);

// Route untuk mengakses file bukti transaksi
router.get("/uploads/bukti-transaksi/:filename", auth, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/bukti-transaksi', filename);
    res.sendFile(filePath);
});

// Route untuk mengakses gambar campaign
router.get("/uploads/campaign-images/:filename", auth, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/campaign-images', filename);
    res.sendFile(filePath);
});

module.exports = router;