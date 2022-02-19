//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const puppeteer = require('puppeteer')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


var allNews = {}; //empy object
var key = 'News';
allNews[key] = []; // empty Array, which you can push() values into


var allNewsCat = {}; //empy object
// var keyCat = "";
// allNewsCat[keyCat] = []; // empty Array, which you can push() values into


//console.log(myNews);



//scrape();
//setTimeout(scrape, 2000);

//console.log(JSON.parse(obj));
// allNews[key].forEach(function(data){
//     console.log(data.getTitles);
// });

app.get("/", function(req, res){   
    res.render("home", {passNews: allNewsCat[keyCat]});
});

app.get("/scraping", function(req, res){   

    async function scrape() {

        console.log("Starting Scraping");
       const browser = await puppeteer.launch({})
       const page = await browser.newPage()
    
       await page.goto('https://heraldodemexico.com.mx/espectaculos/');
        
       

       for(i = 1; i < 11; i++){
        var title = await page.waitForSelector("#loop > article:nth-child(" + i + ") > div > div.col-md-9.col-lg-8 > div > header > div > h2 > a > span");
        let urls = await page.$$eval("#loop > article:nth-child(" + i + ") > div > div.col-md-9.col-lg-8 > div > header > div", links => {
            // Make sure the book to be scraped is in stock
            
            // Extract the links from the data
            links = links.map(el => el.querySelector('h2 > a').href)
            return links;
            });
            //console.log("Link: " + urls);
        var category = await page.waitForSelector("#loop > article:nth-child(" + i + ") > div > div.col-md-9.col-lg-8 > div > header > div > div > span.article__meta--category > a");
        var description = await page.waitForSelector("#loop > article:nth-child(" + i + ") > div > div.col-md-9.col-lg-8 > div > div");
        
        var titletext = await page.evaluate(title => title.textContent, title);
        var categorytext = await page.evaluate(category => category.textContent, category);
        var descriptiontext = await page.evaluate(description => description.textContent, description);
    
        var data = {
            getTitles: titletext,
            getCategories: categorytext,
            getDescriptions: descriptiontext,
            getUrls: urls
        };
    
        allNews[key].push(data);
        
       }
       
       console.log(JSON.stringify(allNews));
    
       browser.close()
    
       //setTimeout(scrape, 2000);

       res.redirect("/");
      
    }

    scrape();
    
});

app.get("/setscraper", function(req, res){   
    res.render("setscraper");
});

app.get("/strsplit", function(req, res){
    getStr = "#loop > article:nth-child(1) > div > div.col-md-9.col-lg-8 > div > header > div > h2 > a > span";
    
    var string = getStr.split("child(1)");

    console.log(getStr);
    console.log(string[0]+"child(");
    console.log(")"+string[1]);

    res.render("strsplit");
});



app.post("/setscraper", function(req, res){

    
    
    const getUrl = req.body.url;
    const getLink = req.body.link;
    const getTitle = req.body.title;
    const getCategory = req.body.category;
    const getCategoryFilter = req.body.categoryfilter;
    const getDescription = req.body.description;

    keyCat = getCategoryFilter;    
    allNewsCat[keyCat] = []; // empty Array, which you can push() values into

    // https://heraldodemexico.com.mx/espectaculos/


    // #loop > article:nth-child(1) > div > div.col-md-9.col-lg-8 > div > header > div > h2 > a > span
    var splitTitle = getTitle.split("child(1)");
    var getTitleA = splitTitle[0]+"child(";
    var getTitleB = ")"+splitTitle[1];

    // #loop > article:nth-child(1) > div > div.col-md-9.col-lg-8 > div > header > div
    var splitLink = getLink.split("child(1)");
    var getLinkA = splitLink[0]+"child(";
    var getLinkB = ")"+splitLink[1];

    // #loop > article:nth-child(1) > div > div.col-md-9.col-lg-8 > div > header > div > div > span.article__meta--category > a
    var splitCategory = getCategory.split("child(1)");
    var getCategoryA = splitCategory[0]+"child(";
    var getCategoryB = ")"+splitCategory[1];

    // #loop > article:nth-child(1) > div > div.col-md-9.col-lg-8 > div > div
    var splitDescription = getDescription.split("child(1)");
    var getDescriptionA = splitDescription[0]+"child(";
    var getDescriptionB = ")"+splitDescription[1];

  
    async function scrapeInt() {

        try{

    console.log("Start Scraping");
       const browser = await puppeteer.launch({})
       const page = await browser.newPage()
    
       await page.goto(getUrl);

       for(i = 1; i < 11; i++){
        var title = await page.waitForSelector(getTitleA + i + getTitleB);
        let urls = await page.$$eval(getLinkA + i + getLinkB, links => {
            // Make sure the book to be scraped is in stock
            
            // Extract the links from the data
            links = links.map(el => el.querySelector('h2 > a').href)
            return links;
            });
            //console.log("Link: " + urls);
        var category = await page.waitForSelector(getCategoryA + i + getCategoryB);
        var description = await page.waitForSelector(getDescriptionA + i + getDescriptionB);
        
        var titletext = await page.evaluate(title => title.textContent, title);
        var categorytext = await page.evaluate(category => category.textContent, category);
        var descriptiontext = await page.evaluate(description => description.textContent, description);
    
        var data = {
            getTitles: titletext,
            getCategories: categorytext,
            getDescriptions: descriptiontext,
            getUrls: urls
        };
    
        allNewsCat[keyCat].push(data);
        
       }
       
       console.log(JSON.stringify(allNewsCat));
    
       browser.close()
    
       //setTimeout(scrape, 2000);

       res.redirect("/");

        }
        catch (error) {
            console.error(error);
          }
      
    }


    scrapeInt();

});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
  
app.listen(port, function() {
    console.log("Server has started successfully");
});