const Discord = require("discord.js");
const fs = require("fs");
const db = require("./db");
const colors = require('colors');

const config = require("./config");

// set up databases
let commands = [];

// read all commands available
fs.readdirSync("./cmds").forEach(cmd => commands[cmd.split(".")[0]] = require(`./cmds/${cmd}`));

console.log(`Loaded the following commands:`);
for (const command in commands) {
    console.log(commands[command].color(command));
}
console.log();

// discord client
const client = new Discord.Client();

client.on("message", msg => {
    let args = msg.content.split(" ");
    let command = args[0].slice(config.prefix.length);
    if (msg.content.startsWith(config.prefix)) {
        if (command in commands) {
            commands[command].fn(msg);
        }
    }
});

client.login(config.token).then(() => {
    console.log("Troy Bot has loaded!");
});