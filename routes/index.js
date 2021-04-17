let express = require("express");
let router = express.Router();
let path = require("path");

/* GET home page. */

router.get("/", function(req, res, next) {
  var options = {
    root: path.join("./public")
  };
  res.sendFile("about.html", options);
});

module.exports = router;
