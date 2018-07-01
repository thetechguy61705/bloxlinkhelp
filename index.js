const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true, fetchAllMembers: true });
bot.commands = { enabledCommands: new Discord.Collection(), disabledCommands: [] };
bot.allcommands = new Discord.Collection();
bot.loaders = { enabledLoaders: [], disabledLoaders: [] };
bot.responses = [];


var loadFile = fs.readdirSync(__dirname + "/load");

for (let file of loadFile) {
	try {
		let loader = require("./load/" + file);
		bot.loaders.enabledLoaders.push(loader);
	} catch (err) {
		bot.loaders.disabledLoaders.push(file);
		console.log(`\nThe ${file} load module failed to load:`);
		console.log(err);
	}
}

var loadResponses = fs.readdirSync(__dirname + "/responses");
for (let response of loadResponses) {
	try {
		let responseFile = require("./responses/" + response);
		bot.responses.push(responseFile);
	} catch (err) {
		console.log(`\nThe ${response} response module failed to load:`);
		console.log(err);
	}
}

function checkCommand(command, name) {
	var resultOfCheck = [true, null];
	if (!command.run) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Function: "module.run" of ${name}.`;
	if (!command.help) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Object: "module.help" of ${name}.`;
	if (command.help && !command.help.name) resultOfCheck[0] = false; resultOfCheck[1] = `Missing String: "module.help.name" of ${name}.`;
	return resultOfCheck;
}

fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	var jsfiles = files.filter((f) => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
	for (let i= 0, len = jsfiles.length; i < len; i++) {
		const f = jsfiles[i];
		try {
			var props = require(`./commands/${f}`);
			bot.allcommands.set(props.help.name, props);
			if (checkCommand(props, f)[0]) {
				bot.commands.enabledCommands.set(props.help.name, props);
			} else {
				throw checkCommand(props, f)[1];
			}
		} catch (err) {
			bot.commands.disabledCommands.push(f);
			console.log(`\nThe ${f} command failed to load:`);
			console.log(err);
		}
	}
});

bot.on("ready", async () => {
	console.log(`${bot.user.tag} is online. ` +
		`${bot.commands.enabledCommands.size}/${bot.commands.enabledCommands.size + bot.commands.disabledCommands.length}` +
		" commands loaded successfully.");
	let canada = bot.loaders.enabledLoaders;
	for (let i= 0, len = canada.length; i < len; i++) {
		const loader = canada[i];
		if (loader.run != null) loader.run(bot);
	}
});

bot.on("message", async (message) => {
	if (message.author.bot) return;
	if (message.channel.name !== "bot-commands" && message.guild.id === "372036754078826496") return;
	if (message.channel.type === "dm") return;
	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);
	if (!message.content.startsWith(botconfig.prefix)) return;
	let commandfile = bot.commands.enabledCommands.get(cmd.slice(prefix.length));
	return commandfile.run(bot, message, args);
});
bot.login(botconfig.token);
