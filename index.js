import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
const port = 3000;
const API_URL = "https://byabbe.se/on-this-day/";
let message = "";
const year = new Date().getFullYear();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

function getMonth(numerical_str){
    const months = {1:"January", 2:"February", 3:"March", 4:"April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10:"October", 11:"November", 12:"December" }
    return months[numerical_str];
}

app.get("/", async (req, res)=>{
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() +1;
    const randomNumber = Math.floor((Math.random()*5) +1);

    try {
        const response = await axios.get(API_URL + `${month}/${day}/events.json`);
        const {wikipedia, date, events} = response.data;
        res.render("index.ejs", {link: wikipedia, date: "Today", events: events, message:message, year: year, imageNum: randomNumber});
    } catch (err){
        res.send({message: "error while fetching data"});
        console.error(err.message);
    }
});
app.post("/submit", async (req, res)=>{
    const {month, day} = req.body
    const randomNumber = Math.floor((Math.random()*5) +1);
    try{const response = await axios.get(API_URL + `${month}/${day}/events.json`);
        // console.log(response.data);
        const {wikipedia, date, events} = response.data;
        res.render("index.ejs", {link: wikipedia, date: `${getMonth(parseInt(month))} ${day}` , events: events, year:year, imageNum: randomNumber});}
    catch {
        message = "Invalid input. Verify your input and try again."
        res.redirect("/");
        }
});


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});
