const {RichEmbed} = require("discord.js");

function genColor() {
    let hex = "#";
    for (let i = 0; i < 6; i++) {
        hex += Math.floor(Math.random() * 16).toString(16)
    }
    return hex;
}

module.exports = (msg, title, description) => {
    return new RichEmbed()
        .setColor(genColor())
        .setTitle(title)
        .setURL("https://github.com/pepsipu/troy.js")
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setDescription(description)
        .setFooter("troy.js is made by pepsipu#5555. Check out http://pepsipu.com.");
};