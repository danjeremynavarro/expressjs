     
window.dannavarro = window.dannavarro ? window.dannavarro : {};

dannavarro.pattern = {
    rss: /rss-/,
}

dannavarro.rss_writer = {
    write: function(data){
        let feed = data.items;
        data.items.forEach((d,i) => {
            let title = d.title;
            let creator = d.creator;
            let content = d.content;
            let forward_link = d.link;
            let html = `
            <div class="rss-article-item">
                <h3 class="rss-article-title">${title}</h3>
                <p class="rss-article-creator">by: ${creator}</p>
                <a href="${forward_link}" class="read-more-link"><u>Read more here!</u></a>
                <p class="rss-article-content">${content}</p>
            </div>
            `;
            dannavarro.rss_writer.append_article(html);
        });
    },
    append_article: function(html){
        let h = html;
        $(".rss-article-container").append(html);
    },
}

dannavarro.utils = {
    tab_view_change: function (current_tab){
        let doc = document.getElementById("tab-view").children;
        for (let i = 0; i < doc.length; i++){
            if (doc[i].id !== current_tab){
                doc[i].style.display = "none";
            } else{
                doc[i].style.display = "block";
            }
        }
    },
    trigger_dropdown: function(element_id){
        let el = document.getElementById(element_id);
        if (el.style === "none"){
            el.style = "box";
        } else{
            el.style = "none";
        }
    },
    trigger_bookmark: function(page_name, article){
        /*  @param page_name - page name category
        *   @param article - article
        *   Saves bookmark as cookie
        */
        let cookie_dict = this.get_cookie_as_dict(document.cookie);
        if(!(page_name in cookie_dict)){
            let addc = page_name + "=" + article;
            document.cookie = addc;
        } else {
            let ar_value = cookie_dict[page_name];
            if (ar_value instanceof Array){
                if (ar_value.includes(article)){
                    return
                } else {
                    ar_value.push(article);
                    ar_value = ar_value.join(",");
                    addc = page_name + "=" + ar_value;
                    document.cookie = addc;
                } 
            }
        }
        dannavarro.onload.bookmark_onload(page_name);
    },
    get_cookie_as_dict: function(cookie){
        // Returns cookie as dictionary
        // Returns cookie value as array
        let decoded_cookie = decodeURIComponent(cookie);
        decoded_cookie = decoded_cookie.split("; ");
        if (decoded_cookie[0] === "") return {}; // Means no cookie so return
        let cookie_dict = {};
        for (let i = 0; i < decoded_cookie.length; i++){
            let kv = decoded_cookie[i].split("=");
            let key = kv[0];
            let key_val = kv[1].split(",");
            cookie_dict[key] = key_val;
        }
        return cookie_dict;
    },
    write_feed: function(page, callback){
        // To do 
        // 1. Write function to write each earticle
        // https://www.space.com/feeds/all
        // https://www.technologyreview.com/feed/
        $.ajax({
            type: "GET",
            url: "/api/rss",
            data: {
                "page" : page
            },
            dataType: "json",
            success: function (response) {        
                callback(response);
            }
        });
    },
    rss_feed_router: function(){
        if(window.location.pathname == "/tech_page.html"){
            dannavarro.utils.write_feed("Tech", dannavarro.rss_writer.write);
        } else if (window.location.pathname == "/science.html"){
            dannavarro.utils.write_feed("Space", dannavarro.rss_writer.write);
        }
    }
};

dannavarro.onload = {
    bookmark_onload: function(page_name){
        let danutils = dannavarro.utils;
        let cookie_dict = danutils.get_cookie_as_dict(document.cookie);
        let cookie_val;XMLDocument
        if (page_name in cookie_dict){
            cookie_val = cookie_dict[page_name];
        } else return;
        for (let i = 0; i < cookie_val.length; i++){
            let av = cookie_val[i]
            let avspan = "span-" + av;
            let avbutton = "button-" + av;
            document.getElementById(avspan).style.display = "inline-block";
            document.getElementById(avbutton).style.display = "none";
            
        }
    }
};

(function(){
    // Runs onload functions on all pages
    let page_articles = ["tech", "science"];
    page_articles.forEach(function(item){
        try{
            dannavarro.onload.bookmark_onload(item);
        }
        catch(e){
            if (e.name === "TypeError"){
                return true;
            }
        }
    });

    $(document).ready(function(){
        $("#nav-bar").hide();

        dannavarro.utils.rss_feed_router();

        $("#hide-menu-button").click(function(){
            $("#nav-bar").toggle("slow");
        });

        $('.btn.rss-control').click(function (e) { 
            e.preventDefault();
            let me = this;
            let rss_index;
            if (this.classList.contains("rss-control")) {
                //rss_index = this.value.replace(dannavarro.pattern.rss, '');
            }
        });
    });
})();
