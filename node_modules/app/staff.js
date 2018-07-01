module.exports = function staff(member) {
	var staff = (member.highestRole.position >= member.guild.roles.find("name", "Helpers").position) ? true : false;
	return staff;
};