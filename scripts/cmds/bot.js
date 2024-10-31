const axios = require("axios");

module.exports.config = {
    name: "bot",
    aliases: ["bby"],
    version: "1.0",
    credits: "Dipto",
    role: 3,
    description: "Chat with baby",
    commandCategory: "fun",
    guide: "{prefix}baby <message>",
    coolDowns: 5,
};

module.exports.onStart = async ({ event, args, message }) => {
    const msg = args.join(" ");

    if (!msg) {
        return message.reply("Please provide a message.");
    }

    try {
        const apiUrl = `https://www.noobs-api.000.pe/dipto/baby?text=${encodeURIComponent(msg)}`;
        const response = await axios.get(apiUrl);
        const data = response.data.reply;

        await message.reply(data);
    } catch (error) {
        message.reply(`Error: ${error.message}`);
    }
};

// New handleMessage function
module.exports.handleMessage = async ({ event, message }) => {
    const { body } = event;

    // Example condition to respond to a specific message
    if (body.toLowerCase() === "bot") {
        const reply = "Hello! What do you want to talk about?";
        await message.reply(reply);
    }
};
