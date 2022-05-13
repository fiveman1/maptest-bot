const { SlashCommandBuilder } = require('@discordjs/builders');
const noblox = require("noblox.js");
const { bhopCookie, surfCookie, deathrunCookie } = require("../config.json");

async function execute(interaction) {
    const game = interaction.options.getString("game");
    let cookie;
    if (game === "bhop") cookie = bhopCookie;
    else if (game === "surf") cookie = surfCookie;
    else if (game === "deathrun") cookie = deathrunCookie;
    else {
        await interaction.reply({content: "Invalid game specified!", ephemeral: true});
        return;
    }
    const id = interaction.options.getInteger("asset_id");
    await noblox.setCookie(cookie).then(async () => {

        // validate that this is a model
        try {
            const info = await noblox.getProductInfo(id);
            if (info.AssetTypeId != 10) {
                await interaction.reply({content: `(id: ${id}) is not a valid model ID.`, ephemeral: true});
                return;
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({content: `There is a problem with this asset ID (id: ${id}).`, ephemeral: true});
            return;
        }

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
                await interaction.reply({content: "The bot has already taken this model!", ephemeral: true});
            } else {
                await interaction.reply({content: `An error occured trying to take the model (id: ${id}). Make sure it is uncopylocked!`, ephemeral: true});
                console.log(`Could not take asset ID ${id}: `);
                console.log(error);
            }
        });
    });
}

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
	execute
};