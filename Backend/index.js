require("dotenv").config();
const express = require("express")
const cors = require('cors');
const path = require('path');
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

const routes = require("./src/routes")

app.use("/api/v1", routes)
const port = 3000
app.listen(port, function(){
    console.log(`listening on port ${port}`);
})