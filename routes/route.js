var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("home.html");
})

router.get("/home", (req, res) => {
    res.render("home.html");
})

router.get("/index", (req, res) => {
    res.render("index.html");
})


router.get("/mobile", (req, res) => {
    res.render("homeM.html");
})

router.get("/homeM", (req, res) => {
    res.render("homeM.html");
})

router.get("/indexM", (req, res) => {
    res.render("indexM.html");
})



/*router.get("/mobile", (req, res) => {
    res.render("indexM.html");
})
*/

var registerUserService = require('../services/registerUserService');

router.post("/registerUser", registerUserService.registerUser);

module.exports = router;
