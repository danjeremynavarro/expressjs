var express = require("express"),
    router = express.Router();

router.get("*", function(req,res,next){
    next();
});

module.exports = router;