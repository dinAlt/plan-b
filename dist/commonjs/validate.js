"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function validateActions(task) {
    task.actions.forEach(function (t) {
        if (typeof t !== "function") {
            throw new Error("Action should be a function, task: \"" + task.name + "\"");
        }
    });
}
function validateTriggers(task) {
    task
        .triggers
        .forEach(function (t) {
        if (t.on !== "init") {
            throw new Error("Triggers \"on\" property should be one of (\"init\",), got " + t.on + ", task: \"" + task.name + "\"");
        }
        if (t.repeat && typeof t.repeat !== "number") {
            throw new Error("Triggers \"repeat.each\" property should be a number, task: \"" + task.name + "\"");
        }
        validateTriggerPlan(t, task);
    });
}
function validateTriggerPlan(trigger, task) {
    if (trigger.plan) {
        if (trigger.plan === "once") {
            return;
        }
        if (typeof trigger.plan === "string") {
            util_1.intervalToMilliseconds(trigger.plan);
            return;
        }
        if (trigger.plan.length &&
            (trigger.plan.length === 2) && (typeof trigger.plan[0] === "number")) {
            util_1.intervalToMilliseconds(trigger.plan[1]);
            return;
        }
        throw new Error("Invalid trigger plan: " + trigger.plan + ", task: " + task.name);
    }
}
function validateTasks(tasks) {
    tasks.forEach(function (t) {
        if (!t.name) {
            throw new Error("Task name required");
        }
        validateTriggers(t);
        validateActions(t);
    });
}
exports.validateTasks = validateTasks;
//# sourceMappingURL=validate.js.map