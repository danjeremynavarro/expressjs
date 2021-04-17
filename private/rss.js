const Parser = require("rss-parser"),
      parser = new Parser();

class RssParser {
    constructor(url){
        this.url = url;
    }
    async readRss(){
        let feed = await parser.parseURL(this.url);
        return feed
    }
}

module.exports = RssParser;