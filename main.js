const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const { reply, unsend, edit, react, buttonMessage } = require("./utils");
const logger = require("./utils/log/logger");

// লগার ইনিশিয়ালাইজ
logger.start();
logger.info("— LOADING COMMANDS —\n");

// গ্লোবাল ফাংশন সেটআপ
global.functions = {
  commands: new Map(),
  aliases: new Map(),
  config,
};

// কমান্ড লোডিং সিস্টেম
const commandFiles = fs
  .readdirSync(path.join(__dirname, "scripts", "cmds"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./scripts/cmds/${file}`);
  global.functions.commands.set(command.config.name, command);
  logger.cmd(`- ${command.config.name} module loaded`);

  command.config.aliases.forEach((alias) =>
    global.functions.aliases.set(alias, command.config.name)
  );
}

logger.color("cyan " + "⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻");
logger.big(`
▒█▀▀█ ░█▀▀█ ▒█▀▀█ ▒█▀▀▀ 　 ▒█▀▀█ ▒█▀▀▀█ ▀▀█▀▀ 
▒█▄▄█ ▒█▄▄█ ▒█░▄▄ ▒█▀▀▀ 　 ▒█▀▀▄ ▒█░░▒█ ░▒█░░ 
▒█░░░ ▒█░▒█ ▒█▄▄█ ▒█▄▄▄ 　 ▒█▄▄█ ▒█▄▄▄█ ░▒█░░`);
logger.info("Page Bot Initialized");
logger.info("Admin: " + global.functions.config.admin);
logger.info("A simple page bot");

// অনুমতি চেক করার ফাংশন
function hasPermission(uid) {
  const admins = global.functions.config.adminBot || [];
  return admins.includes(uid);
}

async function handleMessage(sender_psid, received_message, webhook_event) {
  if (received_message.is_echo) return;

  const { prefix } = global.functions.config;
  const threadID = webhook_event.threadID || sender_psid; // গ্রুপ বা প্রাইভেট আইডি

  // চ্যাট ইভেন্ট হ্যান্ডলিং
  if (received_message.text) {
    const text = received_message.text;

    // অনচ্যাট ইভেন্ট (সব কমান্ডের জন্য)
    for (const command of global.functions.commands.values()) {
      if (command.onChat) {
        try {
          await command.onChat({
            event: received_message,
            fullevent: webhook_event,
            message: {
              senderID: sender_psid,
              threadID: threadID,
              text: text,
              reply: (msg) => reply(threadID, msg),
              unsend: (msgID) => unsend(msgID),
              edit: (msgID, text) => edit(msgID, text),
              react: (emoji) => react(threadID, emoji),
              button: (text, buttons) => buttonMessage(threadID, text, buttons),
            },
          });
        } catch (error) {
          logger.error(`OnChat Error: ${error.message}`);
        }
      }
    }
  }

  // কমান্ড প্রসেসিং
  const body = received_message.text;
  if (!body) return;

  const args = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(/ +/)
    : body.trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    global.functions.commands.get(commandName) ||
    global.functions.commands.get(global.functions.aliases.get(commandName));

  if (command) {
    const { usePrefix = true, role = 0 } = command.config;

    // অনুমতি চেক
    if (role > 0 && !hasPermission(sender_psid)) {
      await reply(threadID, "⚠️ আপনার অনুমতি নেই!");
      return;
    }

    // প্রিফিক্স ভ্যালিডেশন
    if (usePrefix && !body.startsWith(prefix)) return;
    if (!usePrefix && body.startsWith(prefix)) {
      await reply(threadID, `❌ এই কমান্ডে প্রিফিক্স লাগবে না!`);
      return;
    }

    // কমান্ড এক্সিকিউট
    try {
      await command.onStart({
        event: received_message,
        fullevent: webhook_event,
        args: args,
        message: {
          senderID: sender_psid,
          threadID: threadID,
          text: body,
          reply: (msg) => reply(threadID, msg),
          unsend: (msgID) => unsend(msgID),
          edit: (msgID, text) => edit(msgID, text),
          react: (emoji) => react(threadID, emoji),
          button: (text, buttons) => buttonMessage(threadID, text, buttons),
        },
      });
    } catch (error) {
      logger.error(`Command Error [${commandName}]: ${error.message}`);
      await reply(threadID, "❌ কমান্ডে সমস্যা হয়েছে!");
    }
  } else if (body.startsWith(prefix)) {
    await reply(
      threadID,
      `❌ "${commandName}" নামে কোনো কমান্ড নেই! ${prefix}help দেখুন।`
    );
  }
}

module.exports = { handleMessage };
