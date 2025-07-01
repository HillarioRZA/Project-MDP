const db = require("../models");

module.exports = {
    test: async function(req, res){
        const users = await db.User.findAll();
        return res.status(200).send(users);
    },
    testAuth: async function(req, res){
        return res.status(200).json({ message: "Akses berhasil!", user: req.user });
    }
}