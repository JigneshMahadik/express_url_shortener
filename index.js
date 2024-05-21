import express, { urlencoded } from "express";
import { nanoid } from "nanoid";
import fs from "node:fs";
import bodyParser from "body-parser";

import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

// This urlencoded function is an middleware which used to convert html data to json.
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());


// API to make given URL short.
app.post("/",(req,res)=>{
    try {
        // const url = req.body.url;

        const shortUrl = nanoid(8);
        // const urlMap = {
        //     [shortUrl] : req.body.url
        // };
        const fileData = JSON.parse(fs.readFileSync("./urlMap.json",{encoding: "utf-8"}));
        fileData[shortUrl] = req.body.url;
        fs.writeFileSync("./urlMap.json",JSON.stringify(fileData));
        console.log("Url has been shorten and added successfully.");

        res.json({
            status : true,
            Short_URL : "https://express-url-shortener-uhow.onrender.com/"+shortUrl
            // [shortUrl] : req.body.url
        });
    } 
    catch(error){
        console.log(error);
    }
});


// API to get long URL using shortUrl
app.get("/:url",(req,res)=>{
    const shortenUrl = req.params.url;
    const fileData = JSON.parse(fs.readFileSync("./urlMap.json",{encoding: "utf-8"}));
    const longUrl = fileData[shortenUrl];
    // res.json({
    //     status : true,
    //     "long Url" : longUrl
    // })
    res.redirect(longUrl);
});

app.listen(8083,()=>{
    console.log("Server is up and running on port : 8083");
})
