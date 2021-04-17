let express = require("express");
let router = express.Router();
let path = require("path");

router.post("/sendEmail", function(req,res){
    // TODO:
    // JSON Request must have:
    // property @from
    // property @subject
    // property @message
    let email = global.emailTransport;
    let body = req.body;
    try {
        email.sendEmail(body.from, "danjeremynavarro@gmail.com", 
                        body.subject, body.message);
    } catch(e) {
      res.status(400);
      res.json({"error_message": e.message});  
    }
    res.json({"message":"success"});
});

router.get("/rss", function(req,res){
    // Should have params for url. Must return document object of RSS URL
    // Build webpage on client side
    let RssParser = require("../private/rss");
    let rss;
    switch (req.query.page){
        case "Space":
            rss = new RssParser("https://www.space.com/feeds/all");
            break;
        case "Tech":
            rss = new RssParser("https://www.technologyreview.com/feed/"); 
            break;
        default:
            res.status(400);
            res.send({
                "message": "Required params not found"
            });
            return;           
    }
    rss.readRss().then(result => {
        res.status(200);
        res.json(result);
    });
});

module.exports = router;