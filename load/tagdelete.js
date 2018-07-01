module.exports.run = async (bot) => {
	bot.on("message", (message) => {
		if (message.content && message.content.toLowerCase().startsWith(".tag") && message.channel.name === "support") {
			message.delete();
		}
	});
};
