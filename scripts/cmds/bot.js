const axios = require("axios");

module.exports.config = {
    name: "bot",
    aliases: ["bby", "susu"],
    version: "1.0",
    credits: "Dipto",
    role: 0,
    usePrefix: false,
    description: "বেবি বটের সাথে চ্যাট করুন",
    commandCategory: "fun",
    guide: "{pn} <message>",
    coolDowns: 5,
};

module.exports.onStart = async ({ event, args, message }) => {
    const msg = args.join(" ");
    const senderID = event.senderID;
    const name = event.senderName || "User";

    // র‍্যান্ডম মেসেজে শুধু মেনশন দেবে
    if (!msg || msg.toLowerCase() === "susu") {
        const randomMessages = [
            "হাই! আমি কী করতে পারি? 😊",
            "মেসেজ দিন, আমি অপেক্ষা করছি! 💬",
            "আজকে কেমন আছেন? 🌟",
        ];
        const randomReply = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        return message.reply({
            body: `${name}, ${randomReply}`, // এখানে মেনশন
            mentions: [{ tag: name, id: senderID }]
        });
    }

    try {
        // API থেকে রিপ্লাই (মেনশন ছাড়া)
        const apiUrl = `https://www.noobs-api.rf.gd/dipto/baby?text=${encodeURIComponent(msg)}&senderID=${senderID}&font=1`;
        const response = await axios.get(apiUrl);
        const botReply = response.data.reply;

        return message.reply({
            body: botReply // এখানে মেনশন নেই
        });
    } catch (error) {
        message.reply(`❌ সমস্যা: ${error.message}`); // এররেও মেনশন নেই
    }
};
