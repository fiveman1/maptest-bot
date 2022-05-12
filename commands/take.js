const { SlashCommandBuilder } = require('@discordjs/builders');
const noblox = require("noblox.js");
const {cookie} = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Takes an asset ID')
        .addIntegerOption(option =>
            option.setName("asset_id")
            .setDescription("The asset ID of the model")
            .setRequired(true))
        ,
	async execute(interaction) {
        const id = interaction.options.getInteger("asset_id");
        await noblox.setCookie(cookie)
        .then(async () => {
            noblox.buy(id, 0)
            .catch(async (error) => {
                await interaction.reply("Could not take model!");
                console.log("Could not take model: ")
                console.log(error)
            });
        });
		await interaction.reply("Model was taken successfully!");
	},
};