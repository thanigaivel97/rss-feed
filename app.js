const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const fs = require("fs");
const Parser = require("rss-parser");
const rssFeed = require("./model/rssFeed");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
function isEquivalent(a, b) {

    console.log(a , "a" , b , "b")
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    console.log(aProps , "aProps" , bProps , "bProps")

    // if number of properties is different, objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        // if values of same property are not equal, objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // if we made it this far, objects are considered equivalent
    return true;
}

app.get("/get-rss", async (req, res) => {
    try{

        let search_key = req.query.search_key;

    let findCriteria  = {
        title : {$regex : search_key}
    }

    let dataResponse = await rssFeed.find(findCriteria).skip(0).limit(20)
    if(dataResponse && Array.isArray(dataResponse) && dataResponse.length){
        res.json({
            dataResponse ,
            success : true
        })
        return
    }else{
        res.json({
            dataResponse ,
            success : true
        })
        return;
    }


            // Make a new RSS Parser
    const parser = new Parser();

    // Get all the items in the RSS feed
    const feed = await parser.parseURL("https://www.reddit.com/.rss"); // https://www.reddit.com/.rss

    console.log(feed , "feed")

    let items = [];

    // Add the items to the items array
    await Promise.all(feed.items.map(async (currentItem) => {

        // Add a new item if it doesn't already exist
        if (items.filter((item) => isEquivalent(item, currentItem)).length <= 0) {
            items.push(currentItem);
        }

    }));

    // Save the file
    // fs.writeFileSync(fileName, JSON.stringify(items));

    await rssFeed.insertMany(items)

    }catch(err){
        console.log(err)
        return res.json({
            err : err
        })
    }
});

mongoose
    .connect(
        'mongodb+srv://balu:mongopassword@cluster0.6ujrr.mongodb.net/example?retryWrites=true&w=majority', 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("DB Connected!!!")

        app.listen(process.env.PORT || 8000, () =>
            console.log("Server started!!!")
        );
    })
    .catch((err) => {
        console.log(err);
    });