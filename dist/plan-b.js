(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.planB = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var planner_1 = require("./planner");
exports.plan = planner_1.plan;
exports.lastExecuted = planner_1.lastExecuted;

},{"./planner":2}],2:[function(require,module,exports){
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

},{"./storage":3,"./util":4,"./validate":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieStorage = {
    getItem: function (key) {
        return getCookie(key);
    },
    setItem: function (key, value) {
        setCookie(key, value, 94608000, "/");
    },
};
function getCookie(name) {
    return document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + encodeURIComponent(name) + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
}
function setCookie(name, value, expiration, path) {
    if (path === void 0) { path = "/"; }
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=" + encodeURIComponent(path) + ";";
    if (expiration) {
        if (typeof expiration === "number") {
            cookie += " max-age=" + expiration;
        }
        else {
            cookie += " expires=" + expiration.toUTCString();
        }
    }
    document.cookie = cookie;
}

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function intervalToMilliseconds(interval) {
    switch (interval) {
        case "second":
            return 1000;
        case "minute":
            return 60 * intervalToMilliseconds("second");
        case "hour":
            return 60 * intervalToMilliseconds("minute");
        case "day":
            return 24 * intervalToMilliseconds("hour");
        case "week":
            return 7 * intervalToMilliseconds("day");
        default:
            throw new Error("Invalid \"interval\" value " + interval);
    }
}
exports.intervalToMilliseconds = intervalToMilliseconds;

},{}],5:[function(require,module,exports){
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

},{"./util":4}]},{},[1])(1)
});

//# sourceMappingURL=plan-b.js.map
