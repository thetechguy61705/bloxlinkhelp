module.exports.run = async (bot) => {
	var responses = bot.responses;
	bot.on("message", (message) => {
		if (message.author.bot || !message.content || message.channel.name !== "support") return;
		for (let response of responses) {
			for (let keyword of response.keywords) {
				if (message.content.toLowerCase().includes(keyword)) {
					return message.channel.send(response.response);
				}
			}
		}
	});
};
