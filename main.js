const Discord = require("discord.js");
const Enmap = require("enmap");

const config = require("./config");

// set up databases
const homework = new Enmap({
    name: "homework"
});

const users = new Enmap({
    name: "users"
});

const tests = new Enmap({
    name: "tests"
});

// discord client
const client = new Discord.Client();

client.login(config.token).then(() => {
    console.log("Troy Bot has loaded!");
});