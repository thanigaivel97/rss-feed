const mongoose = require("mongoose");

const schema = mongoose.Schema;

const rssModel = new schema({
    title : {
         type: String,
        default: ""

    },
     link : {
         type: String,
        default: ""

    },
        pubDate : {
         type: String,
        default: ""

    },
        author : {
         type: String,
        default: ""

    },
        content : {
         type: String,
        default: ""

    },
        contentSnippet : {
         type: String,
        default: ""

    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("rssFeed", rssModel);