const jwt = require("jsonwebtoken");
const secretkey = "ProjectMDP"

function auth(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Token tidak ditemukan" });
    }
    const token = authHeader.split(" ")[1]; // Format: Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
    try {
        const decoded = jwt.verify(token, secretkey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
    }
}

function isFundraiser(req, res, next) {
    if (req.user.role !== 'fundraiser') {
        return res.status(403).json({ message: "Akses khusus fundraiser" });
    }
    next();
}

function isDonatur(req, res, next) {
    if (req.user.role !== 'donatur') {
        return res.status(403).json({ message: "Akses khusus donatur" });
    }
    next();
}

function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses khusus admin" });
    }
    next();
}

module.exports = auth;
module.exports.isFundraiser = isFundraiser;
module.exports.isDonatur = isDonatur;
module.exports.isAdmin = isAdmin;
