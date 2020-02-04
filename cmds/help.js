const fs = require("fs");
const colors = require("colors");
const Discord = require("discord.js");

let help_info = [];

module.exports.fn = msg => {
    let help_msg = new Discord.RichEmbed()
        .setColor("#D20F0F")
        .setTitle("Help")
        .setURL("https://github.com/pepsipu/troy.js")
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setDescription("Here are a list of commands to help you survive Troy.")
        .setFooter("troy.js is made by pepsipu#5555. Check out http://pepsipu.com.");
    for (let info in help_info) {
        help_msg.addField(info, help_info[info]);
    }
    msg.channel.send(help_msg)
};

module.exports.setup = (commands) => {
    for (let command in commands) {
        help_info[command] = commands[command].description;
    }
};

module.exports.color = colors.blue;
module.exports.description = "The help function displays commands that can be used.";