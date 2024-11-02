const axios = require('axios'); // Ensure you have axios imported

module.exports.config = {
    name: "noprefix",
    aliases: ["repeat"],
    version: "1.0",
    author: "dipto",
    countDown: 5,
    role: 0,
    category: "utility",
    description: "Echoes back the user's message",
    usages: "echo <message>"
};

module.exports.onChat = async function ({ event, args, message }) {
    const msg = args.join(" ");

    if (!msg) {
        return message.reply("Please provide a message.");
    }

    try {
        const messageContent = event.text;
        if (messageContent.startsWith("ck")) {
            const apiUrl = `https://www.noobs-api.000.pe/dipto/baby?text=${encodeURIComponent(msg)}`;
            const response = await axios.get(apiUrl);
            const data = response.data.reply;

        
        } else {
            await message.reply(msg); // Echo back the message if it doesn't start with "ck"
        }
    } catch (error) {
        message.reply(error.message);
    }
};
