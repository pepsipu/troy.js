const dbs = require("../db");
const colors = require("colors");
const embed = require("../misc/embed");
const classes = require("../subjects.json");

const date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function valid_class(msg, args) {
    let assignment_meta = args[2].split(":");
    if (assignment_meta.length < 2) {
        msg.channel.send(err);
        return false;
    }
    let days_until_due;
    if (assignment_meta.length > 2) {
        days_until_due = parseInt(assignment_meta[2]);
        if (days_until_due === NaN || days_until_due <= 0) {
            let err = embed(msg, "Invalid Due Date", `"${assignment_meta[2]}" is not a valid due date. Make sure it is positive`);
            return false;
        }
    } else {
        days_until_due = 1;
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
    let err = embed(msg, "homework Command", "Here is how to use the homework command.");
    err.addField("hw add class:teacher:days_until_due assignment_name", "Adds a homework assignment to a certain class. Even if there is no homework, put 'no homework'! For example, 'hw add bio:ngo outline 10.intro - 10.9' is a valid way to format an assignment and would be due tomorrow. Or, 'hw add bio:kirkpatrick:3 bring ritual offerings' would be an assignment due in 3 days.");
    err.addField("hw get class:teacher:days_until_due", "Fetches homework from a specified amount of days from now. For example, 'hw get bio:ngo:2' would get the homework for after tomorrow. By default, 'hw get bio:ngo' with no days from now specified, the homework due tomorrow will be given.");
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
        let due_date = new Date;
        due_date.setDate(due_date.getDate() + days_until_due);
        dbs.homework.push(class_input[0], {
            assignment: assignment,
            due_date: due_date.getTime()
        }, class_input[1]);
        msg.channel.send(embed(msg, "Homework added!", `"${assignment}" has been added for homework today, due in ${days_until_due} ${days_until_due === 1 ? "day" : "days"}`))
    } else if (args[1] === "get") {
        if (args.length < 3) {
            msg.channel.send(err);
            return;
        }
        let [class_input, days_until_due] = valid_class(msg, args);
        if (!class_input) {
            return;
        }
        let homework_msg = embed(msg, `Homework for class ${class_input[0]} for teacher ${class_input[1]}.`, "Make sure to get it all done!");
        dbs.homework.get(class_input[0], class_input[1]).forEach(assignment => {
            let due_date = new Date(assignment.due_date);
            let search_date = new Date();
            search_date.setDate(search_date.getDate() + days_until_due);
            if (due_date.getDate() === search_date.getDate() && due_date.getFullYear() === search_date.getFullYear() && due_date.getMonth() === search_date.getMonth()) {
                homework_msg.addField(assignment.assignment, `Due on ${due_date.toLocaleDateString("en-US", date_options)}`);
            }
        });
        msg.channel.send(homework_msg);
    } else if (args[1] === "clear" && msg.author.id === "475525381609357313") {
        if (args.length < 3) {
            msg.channel.send(err);
            return;
        }
        let [class_input, days_until_due] = valid_class(msg, args);
        dbs.homework.set(`${class_input[0]}.${class_input[1]}`, []);
        msg.channel.send(embed(msg, "Cleared!", `homework for ${class_input[0]} for ${class_input[1]} has been cleared.`));
    }
};

module.exports.color = colors.yellow;
module.exports.description = "Find homework or add homework for a certain class. Do 'hw' for help.";
