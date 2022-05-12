const noblox = require("noblox.js");
const { Client, Intents } = require("discord.js");
const {cookie, token} = require("./config.json");

function buyAsset(id) {
    noblox.setCookie(cookie)
    .then(async () => {
        noblox.buy(921233306, 0)
            .catch(async (error) => {
                console.log("Could not purchase, error: ")
                console.log(error)
            });
    });
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once("ready", () => {
    console.log("Ready");
});

client.login(token);