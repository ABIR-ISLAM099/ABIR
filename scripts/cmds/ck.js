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
    try {
        const messageContent = event.text;
        if(messageContent.startsWith("ck")){
    const responseMessage = ["Hey baby","yes baby","😘😘 yes","ya baby i am listening","😘😘Hey"];
    const randomIndex = responseMessage[Math.floor(Math.random() * responseMessage.length)];
    await message.reply(randomIndex);
   }
    } catch (error) {
        message.reply(error.message)
    }
};
