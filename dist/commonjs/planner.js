"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("./storage");
var util_1 = require("./util");
var validate_1 = require("./validate");
function plan(tasks) {
    if (localStorage) {
        gStorage = localStorage;
    }
    else {
        gStorage = storage_1.cookieStorage;
    }
    validate_1.validateTasks(tasks);
    gTasks = tasks;
    gTasks.forEach(function (task) {
        setUpTriggers(task);
    });
}
exports.plan = plan;
function lastExecuted(task) {
    var tasks = gTasks.filter(function (t) { return t.name === task; });
    if (tasks.length) {
        return getLastExec(tasks[0]);
    }
    return undefined;
}
exports.lastExecuted = lastExecuted;
var gTasks;
var gStorage;
function setUpTriggers(task) {
    if (!task.actions || !task.actions.length) {
        return;
    }
    task
        .triggers
        .forEach(function (trigger) {
        if (!planed(task, trigger)) {
            return;
        }
        if (trigger.on === "init") {
            setUpTimerActions(task, trigger, trigger.timeout || 0, trigger.repeat || 0);
        }
    });
}
function getLastExec(task) {
    var d = Number(gStorage.getItem("task:" + task.name));
    if (d) {
        return new Date(d);
    }
    return undefined;
}
function setUpTimerActions(task, trigger, timeout, repeat) {
    if (timeout === void 0) { timeout = 0; }
    if (repeat === void 0) { repeat = 0; }
    var action = function () {
        if (trigger.check && !trigger.check(task.name)) {
            return;
        }
        task.actions.forEach(function (t) { return t(); });
        gStorage.setItem("task:" + task.name, (new Date()).getTime().toString());
    };
    setTimeout(function () {
        action();
        if (repeat) {
            setInterval(action, repeat);
        }
    }, timeout);
}
function planed(task, trigger) {
    var lastExec = getLastExec(task);
    if (trigger.plan) {
        if (trigger.plan === "once") {
            if (lastExec) {
                return false;
            }
            return true;
        }
        var interval = void 0;
        if (typeof trigger.plan === "object") {
            interval = trigger.plan[0] * util_1.intervalToMilliseconds(trigger.plan[1]);
        }
        else {
            interval = util_1.intervalToMilliseconds(trigger.plan);
        }
        if (lastExec && ((Date.now() - lastExec.getTime()) < interval)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=planner.js.map