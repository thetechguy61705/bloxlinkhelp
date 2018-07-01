module.exports.run = async (bot, message) => {
	message.reply("https://discordapp.com/api/oauth2/authorize?client_id=463121602847178773&permissions=27648&scope=bot");
};
module.exports.help = {
	name: "invite"
};