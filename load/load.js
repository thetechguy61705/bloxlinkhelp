module.exports.run = async (bot) => {
	bot.on("message", (message) => {
		if (!message.mentions.members) return;
		let mention = message.mentions.members.first();
		var checker;
		if (mention) {
			checker = bot.rateLimits.afk.find((value) => value.user === mention.id);
			if (checker)
				if (checker.user !== message.author.id)
					message.reply(`This user is currently AFK!\nAFK Message: \`${checker.reason}\``).then((msg) => msg.delete(5000)).catch(function() {});
		}
		checker = bot.rateLimits.afk.find((value) => value.user === message.author.id);
		if (checker) {
			bot.rateLimits.afk.splice(bot.rateLimits.afk.indexOf(checker), 1);
			message.reply("Welcome back! Your AFK status was removed.").then((msg) => msg.delete(5000)).catch(function() {});
		}
	});
};
