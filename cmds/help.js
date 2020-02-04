const fs = require("fs");
const colors = require("colors");
const Discord = require("discord.js");
const embed = require("../misc/embed");
let help_info = [];

module.exports.fn = msg => {
    let help_msg = embed(msg, "Help", "Here are a list of commands to help you survive Troy.");
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