const { SlashCommandBuilder } = require('@discordjs/builders');
const { parse } = require("csv-parse/sync");
const fs = require('node:fs');
const noblox = require("noblox.js");

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
        fs.writeFileSync(fname, "id,timestamp\n");
    }

    const id = interaction.options.getInteger("asset_id");
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

    const csv = fs.readFileSync(fname);
    const records = parse(csv, {delimiter: ',', fromLine: 2});

    let s = "id,timestamp\n";
    for (let record of records) {
        const rid = record[0];
        const rtimestamp = record[1];
        if (id == rid) {
            await interaction.reply({content: `Tried to submit map (id: ${id}) that already exists!`, ephemeral: true});
            return;
        }
        s += `${rid},${rtimestamp}\n`;
    }

    const unix = Math.round(+new Date()/1000);
    s += `${id},${unix}\n`;

    fs.writeFileSync(fname, s);

    await interaction.reply(`Map (id: ${id}) successfully submitted.`);
    
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Submit your map')
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