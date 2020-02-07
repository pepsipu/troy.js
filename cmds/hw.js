const dbs = require("../db");
const colors = require("colors");
const embed = require("../misc/embed");
const classes = require("../subjects.json");

function valid_class(msg, args) {
        let assignment_meta = args[2].split(":");
        if (assignment_meta.length < 2) {
            msg.channel.send(err);
            return false;
        }
	if (assignment_meta.length < 3) {
	    let days_until_due = parseInt(args[2]);
	    if (days_until_due == NaN || days_until_due <= 0) {
	    	let err = embed(msg, "Invalid Due Date", `"${assignment_meta[2]}" is not a valid due date. Make sure it is positive`);
		return false;
	    }
	} else {
	    let days_until_due = 1;
	}
        if (!(assignment_meta[0] in classes)) {
            let err = embed(msg, "Invalid Subject", `"${assignment_meta[0]}" is not a valid subject. Valid subjects are: `);
            for (class_i in classes) {
                err.addField(class_i, class_i);
            }
            msg.channel.send(err);
            return false;
        }
        if (!(classes[assignment_meta[0]].includes(assignment_meta[1]))) {
            let err = embed(msg, "Invalid Teacher", `"${assignment_meta[1]}" is not a valid teacher. Valid teachers are:`);
            classes[assignment_meta[0]].forEach(teacher => {
                err.addField(teacher, "Completely valid.");
            });
            msg.channel.send(err);
            return false;
        }
	return [assignment_meta, days_until_due];
}

module.exports.fn = (msg, args) => {
    let err = embed(msg, "HW Command", "Here is how to use the HW command");
    err.addField("hw add class:teacher:days_until_due assignment_name", "Adds a homework assignment to a certain class. Even if there is no homework, put 'no homework'! For example, 'hw add bio:ngo outline 10.intro - 10.9' is a valid way to format an assignment and would be due tomorrow. Or, 'hw add bio:kirkpatrick:3 bring ritual offerings' would be an assignment due in 3 days.");
    if (args[1] === "add") {
        if (args.length < 4) {
            msg.channel.send(err);
            return;
        }
        let [class_input, days_until_due] = valid_class(msg, args);
	if (!class_input) {
	    return;
	}
	let assignment = args.slice(3).join(" ");
        dbs.homework.push(class_input[0], assignment, class_input[1]);
        msg.channel.send(embed(msg, "Homework added!", `"${assignment}" has been added for homework today, due in ${days_until_due} ${days_until_due === 1 ? "day": "days"}`))
    } else if (args[1] === "get") {
        if (args.length < 3) {
	    msg.channel.send(err);
            return;
	}
	let class_input = valid_class(msg, args);
        if (!class_input) {
            return;
	}
    	let homework_msg = embed(msg, `Today's howework for ${class_input[0]} for ${class_input[1]}.`, "Make sure to get it all done!");
        dbs.homework.get(class_input[0], class_input[1]).forEach(assignment => {
            homework_msg.addField(assignment, "Due tommorow!");
	});
	msg.channel.send(homework_msg);
    } else if (args[1] === "clear") {
    
    }
};

module.exports.color = colors.yellow;
module.exports.description = "Find homework or add homework for a certain class.";
