const express = require("express")
const urlRoute = require("./routes/url");
const { connectToMongoDb } = require("./connect")
const URL = require('./models/url')
const path = require('path')
const staticRoute = require('./routes/staticRouter')

const app = express();
const PORT = 8001;

// connection
connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => console.log("MongoDb connected"))

// SETTING UP OF EJS ENGINE FOR SERVER-SIDE RENDERING
app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.use("/", staticRoute);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false})); //for form data

// routes

// SERVER SIDE RENDERING
// app.get("/test",async(req, res) => {
//     const allUrls = await URL.find({});
    // return res.end(`
    //     <html>
    //         <head></head>
    //         <body>
    //             <ol>
    //                 ${allUrls.map((url) => `<li>${url.shortId} - ${url.redirectUrl} - ${url.visitHistory.length}</li>`)
    //             .join("")}
    //             </ol>
    //         </body>
    //     </html>
    // `)
//     return res.render("home",{
//         urls: allUrls,
//     });
// })


app.use("/url", urlRoute);
app.get("/url/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    }});
    res.redirect(entry.redirectUrl);
})

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))