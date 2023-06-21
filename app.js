const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const moment = require('moment');




const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {

    const userName = req.body.userName;
    const url = `https://api.github.com/users/${userName}`;
    const options = {
        headers: {
            'User-Agent': 'MyGitHubApp (chaudharipruthviraj888@gmail.com)'
        }
    };

    https.get(url, options, (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            try {
                const userData = JSON.parse(data);
                console.log(userData);
                const jsonDate = userData.created_at;
                const formattedDate = moment(jsonDate).format("YYYY-MM-DD");
                res.render("result", {
                    pic: userData.avatar_url,
                    name: userData.name,
                    username: userData.login,
                    date: formattedDate,
                    bio: userData.bio,
                    repo: userData.public_repos,
                    followers: userData.followers,
                    following: userData.following,
                    location: userData.location,
                    link: userData.blog,
                    twitter: userData.twitter_username,
                    company: userData.company
                });
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        });
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port 3000");
});
