const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid"); // Tidak perlu uuid lagi
const { Op } = require("sequelize");
const { registerValidation, loginValidation } = require("../validations/user-validation");
const secretkey = "ProjectMDP"

module.exports = {
    register: async function(req, res){
        const { error } = registerValidation.validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }

        const { firstName, lastName, email, password, role } = req.body;
        // Cek email unik
        const existingUser = await db.User.findOne({ where: { email } });
        console.log(existingUser)
        if(existingUser){
            return res.status(400).send("Email sudah terdaftar");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Cari userId terakhir
        const lastUser = await db.User.findOne({
            order: [["user_id", "DESC"]],
        });
        let newIdNumber = 1;
        if (lastUser) {
            const lastIdNumber = parseInt(lastUser.user_id.substring(2));
            newIdNumber = lastIdNumber + 1;
        }
        const userId = `US${String(newIdNumber).padStart(3, '0')}`;
        console.log(userId)
        const user = await db.User.create({
            user_id:userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            created_at:new Date(),
            updated_at:new Date()
        });

        return res.status(200).json(user);
    },
    login: async function(req, res){
        const { error } = loginValidation.validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }

        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });
        if(!user){
            return res.status(400).send("Email tidak ditemukan");
        }

        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass){
            return res.status(400).send("Password salah");
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, secretkey, { expiresIn: "1d" });
        // Hilangkan password dari response
        const userData = user.toJSON();
        delete userData.password;
        return res.status(200).json({ user: userData, token });
    }
}