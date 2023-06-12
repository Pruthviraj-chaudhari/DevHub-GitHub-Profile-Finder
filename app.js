const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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
                res.setHeader('Content-Type', 'text/html');
                res.write("<h2>Name of Developer: " + userData.name + "</h2>");
                res.write("<h2>Bio: " + userData.bio + "</h2>");
                res.write("<h2>Followers: " + userData.followers + "</h2>");
                res.write("<h2>Following: " + userData.following + "</h2>");
                res.write("<img src='" + userData.avatar_url + "'>");
                res.send();
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        });
    });


});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
