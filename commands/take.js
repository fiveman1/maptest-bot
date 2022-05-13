const { SlashCommandBuilder } = require('@discordjs/builders');
const noblox = require("noblox.js");
const { bhopCookie, surfCookie, deathrunCookie } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Takes an asset ID')
        .addStringOption(option =>
            option.setName("game")
            .setDescription("Select the maptest game")
            .setRequired(true)
            .addChoices({name: "bhop", value: "bhop"}, {name: "surf", value: "surf"}, {name: "deathrun", value: "deathrun"}))
        .addIntegerOption(option =>
            option.setName("asset_id")
            .setDescription("The asset ID of the model")
            .setRequired(true))
        ,
	async execute(interaction) {
        const game = interaction.options.getString("game");
        let cookie;
        if (game == "bhop") cookie = bhopCookie;
        else if (game == "surf") cookie = surfCookie;
        else if (game == "deathrun") cookie = deathrunCookie;
        else {
            await interaction.reply("Invalid game specified!");
            return;
        }
        const id = interaction.options.getInteger("asset_id");
        await noblox.setCookie(cookie).then(async () => {
            noblox.buy(id, 0).then(async () => {
                await interaction.reply(
`
Now that your map (id: ${id}) has been taken by the ${game} maptest bot you can load it into the ${game} maptest place. To load your map, join the game and say 
\`\`\`
!map ${id}
\`\`\`Read what it says.  If your map successfully loaded type !rtv and then choose your map.
If it did not load successfully, you can expand the chat to view the full error message by clicking and dragging on the edge of the chat.
`
                );
            })
            .catch(async (error) => {
                if (error.message == "You already own this item.") {
                    await interaction.reply("The bot has already taken this model!");
                } else {
                    await interaction.reply(`An error occured trying to take the model (id: ${id}). Make sure it is uncopylocked!`);
                    console.log(`Could not take asset ID ${id}: `);
                    console.log(error);
                }
            });
        });
	}
};