const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require("discord.js");
const fs = require('node:fs');

async function execute(interaction) {
    const game = interaction.options.getString("game");

    let fname;
    if (game === "bhop") fname = "files/bhop_submissions.csv";
    else if (game === "surf") fname = "files/surf_submissions.csv";
    else if (game === "deathrun") fname = "files/deathrun_submissions.csv";
    else {
        await interaction.reply({content: "Invalid game specified!", ephemeral: true});
        return;
    }

    if (!fs.existsSync(fname)) {
        await interaction.reply(`No submissions exist yet for ${game}.`);
        return;
    }

    const csv = fs.readFileSync(fname);
    const file = new MessageAttachment(csv, fname);
    await interaction.reply({files: [file]});
    
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submissions')
		.setDescription('View the submissions in .csv format')
        .addStringOption(option =>
            option.setName("game")
            .setDescription("Select the maptest game")
            .setRequired(true)
            .addChoices({name: "bhop", value: "bhop"}, {name: "surf", value: "surf"}, {name: "deathrun", value: "deathrun"}))
        ,
	execute
};