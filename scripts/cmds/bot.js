const axios = require("axios");

module.exports.config = {
    name: "bot",
    aliases: ["bby"],
    version: "1.0",
    credits: "Dipto",
    role: 0,
    usePrefix: false,
    description: "Chat with baby",
    commandCategory: "fun",
    guide: "{prefix}baby <message>",
    coolDowns: 5,
};

module.exports.onStart = async ({ event, args, message }) => {
    const msg = args.join(" ");

    if (!msg) {
        return message.reply("Bolo Janu🥰");
    }

    try {
        const apiUrl = `https://simsimi-fun.vercel.app/sim?text=${encodeURIComponent(msg)}`;
        const response = await axios.get(apiUrl);
        const data = response.data.reply;

        await message.reply(data);
    } catch (error) {
        message.reply(`Error: ${error.message}`);
    }
};
