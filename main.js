const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const { reply, unsend, edit, react , buttonMessage } = require("./utils");
const logger = require("./utils/log/logger")
global.functions = {
  commands: new Map(),
  aliases: new Map(),
  config,
};
    logger.start();
logger.info("— LOADING COMMANDS —\n")
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
▒█░░░ ▒█░▒█ ▒█▄▄█ ▒█▄▄▄ 　 ▒█▄▄█ ▒█▄▄▄█ ░▒█░░`)
logger.info("Page Bot Initialized");
logger.info("Admin: " + global.functions.config.admin);
logger.info("A simple page bot");


async function handleMessage(sender_psid, received_message, webhook_event) {
//  if (received_message.is_echo) return;

  const { prefix } = global.functions.config;
  console.log("EVENT: ",webhook_event);
  
 /* 
 // Example of Attachment //
 if (received_message.attachments && received_message.attachments.length > 0) {
    for (const attachment of received_message.attachments) {
      const attachmentType = attachment.type;
      const attachmentUrl = attachment.payload.url;

      await reply(sender_psid, {
        attachment: {
          type: attachmentType,
          url: attachmentUrl,
        },
      });
    }
    return;
  }*/
  const text = received_message.text;

  // [ onChat ] //
  for (const command of global.functions.commands.values()) {
    if (received_message.is_echo) return;
    if (command.onChat) {
      try {
        await command.onChat({
          event: received_message,
          fullevent: webhook_event,
          message: {
            senderID: sender_psid,
            text,
            reply: (textOrMessage) => reply(sender_psid, textOrMessage),
            unsend: (message_id) => unsend(message_id),
            edit: (message_id, new_text) => edit(message_id, new_text),
            react: (emoji) => react(sender_psid, emoji),
            button: (text, buttons) => buttonMessage(sender_psid, text, buttons),
          },
        });
      } catch (error) {
        console.error(`Error in onChat for command ${command.config.name}:`, error);
      }
    }
  }
  const body = received_message.text;
  if (!body) return;
    const args = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/ +/) : body.trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = global.functions.commands.get(commandName) ||
      global.functions.commands.get(global.functions.aliases.get(commandName));

    if (command) {
 
const { usePrefix = true ,role = 0 } = command.config;
    if (role === 1 && !hasPermission(sender_psid)) {
        await reply(sender_psid, "You don’t have permission to use this command.");
        return;
    }
      if (!usePrefix && body.startsWith(prefix)) {
          return await reply(sender_psid,`The command "${commandName}" does not require a prefix.`);
      }
      if (usePrefix && !body.startsWith(prefix)) {
						return; 
      }
      try {
        await command.onStart({
          event: received_message,
          fullevent: webhook_event,
          args,
          message: {
            senderID: sender_psid,
            text: received_message.text,
            reply: (textOrMessage) => reply(sender_psid, textOrMessage),
            unsend: (message_id) => unsend(message_id),
            edit: (message_id,new_text) => edit(message_id, new_text),
            react: (emoji) => react(sender_psid, emoji),
            button: (text, buttons) => buttonMessage(sender_psid, text, buttons)
          },
        });
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
      }
    } else if(!command && body.startsWith(prefix)){
      await reply(sender_psid, commandName ? `The command "${commandName}" does not exist. Type ${prefix}help to see available commands.` : `The command you are using does not exist System, type ${prefix}help to see all available commands.`);
    }
}

function hasPermission(uid) {
 const admins = global.functions.config.adminBot || []
  return admins.includes(uid);
}
module.exports = { handleMessage };
