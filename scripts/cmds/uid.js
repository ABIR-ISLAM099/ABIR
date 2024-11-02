module.exports.config = {
    name: "uid",
    aliases: ["senderid"],
    version: "1.0",
    author: "dipto",
    countDown: 5,
    role: 0,
    usePrefix: true,
    category: "utility",
    description: "Echoes back the user's message",
    usages: "echo <message>"
};

module.exports.onStart = async function ({ fullevent, args, message }) {
    try {
        const messageContent = fullevent.sender.id
    await message.reply(messageContent);
    } catch (error) {
        message.reply(error.message)
    }
};
