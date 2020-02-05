const db = require("../db");
const colors = require("colors");
const Discord = require("discord.js");
const embed = require("../misc/embed");
const classes = require("../subjects.json");

module.exports.fn = (msg, args) => {
    let err = embed(msg, "HW Command", "Here is how to use the HW command");
    err.addField("hw add class:teacher assignment_name", "Adds a homework assignment to a certain class. Even if there is no homework, put 'no homework'! For example, 'hw add bio:ngo outline 10.intro - 10.9' is a valid way to format an assignment.");
    if (args.length < 4) {
        msg.channel.send(err);
        return;
    }
    if (args[1] === "add") {
        let assignment_meta = args[2].split(":");
        if (assignment_meta.length < 2) {
            msg.channel.send(err);
            return;
        }
        if (!(assignment_meta[0] in classes)) {
            let err = embed(msg, "Invalid Subject", `"${assignment_meta[0]}" is not a valid subject. Valid subjects are: `);
            for (class_i in classes) {
                err.addField(class_i, class_i);
            }
            msg.channel.send(err);
            return;
        }
        if (!(classes[assignment_meta[0]].includes(assignment_meta[1]))) {
            let err = embed(msg, "Invalid Teacher", `"${assignment_meta[1]}" is not a valid teacher. Valid teachers are:`);
            classes[assignment_meta[0]].forEach(teacher => {
                err.addField(teacher, "Completely valid.");
            });
            msg.channel.send(err);
            return;
        }
        let assignment = args.slice(3).join(" ");

        console.log(assignment);
    }
};

module.exports.color = colors.yellow;
module.exports.description = "Find homework or add homework for a certain class.";
