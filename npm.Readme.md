# plan-b
Simple javascript lib for executing tasks on web pages

## Installation
```shell
$ npm i --save @dinalt/plan-b
```

## Usage

Node:
```js
var planB = require("@dinalt/plan-b")

document.addEventListener("DOMContentLoaded", function () {
    planB.plan([
        //This will be executed once
        {
            name: "execute_once",
            actions: [function () { console.log("Once") }],
            triggers: [{ on: "init", plan: "once" }],
        },
        //This will be executed each ten seconds after thirty seconds timeout
        {
            name: "execute_with_timeout_and_repeat",
            actions: [function () { console.log("Timeout and repeat") }],
            triggers: [{ on: "init", timeout: 30000, repeat: 10000 }],
        },
        //This will be executed if local storage do not contains "form_submitted" value. 
        //If task executed, next try will be in four weeks.
        {
            name: "execute_with_plan_and_check",
            actions: [function () { console.log("Execute each four week with check") }],
            triggers: [{
                on: "init",
                plan: [4, "week"], //Array may be replaced by a "week" literal, if first element is 1
                check: function () { return !localStorage.getItem("form_submitted") },
            }],
        },
    ]);

    //Prints last execution date of "execute_once" task into console
    console.log(planB.lastExecuted("execute_once"));
});
```

TypeScript:
```ts
import { plan, lastExecuted } from "@dinalt/plan-b";

plan([
    ...
]);

console.log(lastExecuted("..."));
```

Browser ``<script>`` tag:

Compiled version of the library could be found in "dist" directory of root package folder.

## Explanation

### Task object

The ``plan`` function takes and ``array of task`` objects as an argument.
Each task must contain three required properties: 
* **name** ``(string)`` - Identifier of a task (should be unique)
* **actions** ``(array of functions)`` - an array of callbacks, which will be executed when task fires
* **triggers** ``(array of "trigger" objects)``

### Trigger object

The trigger object contains one required property:
* **on** ``(string)`` - trigger type, it only can have "init" value in current version (v0.1)

It also could contains four optional properties:
* **timeout** ``number`` - timeout in milliseconds (see example)
* **repeat** ``number`` - repeat interval in milliseconds (see example)
* **plan** ``(string | [number, string])`` - execution plan
* **check** ``(() => boolean)`` - a callback which will be executed before each task run, to determine whether task should be executed or not (may take optional string argument with task name)

### Plan property

The ``plan`` property of ``trigger`` may contains several value types:
* **"once"** - string value (task will be executed once)
* **[number, string]** - an array, where first element contains amount of time intervals, specified by second element 
(second element can take one of **"second", "minute", "hour", "day", "week"** values) (see example)
* one of **"second", "minute", "hour", "day", "week"** values (short form of previous version, where first element of array is set to 1) (see example)

## How is it works

When ``planB.plan(tasks)`` function is called, library checks execution triggers of each task. If trigger condition is match, task actions will be planned for execution by ``setTimeout`` js function. If ``timeout`` property of trigger is set, it will be passed as second argument to ``setTimeout``. For handling ``trigger.repeat`` property, ``setInterval`` is used. 

**Conditions of ``trigger.plan`` property are checked only once per ``planB.plan`` execution**. Let's imagine, you use ``DOMContentLoaded`` js event for handling task execution and ``trigger.plan`` property is set to ``"minute"``. It will be necessary for user to reload the page to start the task, even if it has already been a minute since the last launch.

The ``trigger.check`` fires before each task launch.

For storing task last execution date and time, browser local store (or cookies, if local store is unsupported) are used.
