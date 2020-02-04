const {RichEmbed} = require("discord.js");

module.exports = (msg, title, description) => {
    return new RichEmbed()
        .setColor("#D20F0F")
        .setTitle(title)
        .setURL("https://github.com/pepsipu/troy.js")
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setDescription(description)
        .setFooter("troy.js is made by pepsipu#5555. Check out http://pepsipu.com.");
};