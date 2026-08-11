require("dotenv").config();

const { google } = require("googleapis");
const readline = require("readline");

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "urn:ietf:wg:oauth:2.0:oob"
);

const scopes = [
    "https://www.googleapis.com/auth/gmail.send"
];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
});

console.log("\n========================================");

console.log(authUrl);
console.log("========================================\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Paste the authorization code here: ", async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);

        console.log("\n==============================");
        console.log("REFRESH TOKEN:");
        console.log(tokens.refresh_token);
        console.log("==============================");

        rl.close();
    } catch (err) {
        console.error(err);
        rl.close();
    }
});
