import { cookieStorage } from "./storage";
import { IntervalTypes, IStorage, ITask, ITrigger } from "./types";
import { intervalToMilliseconds } from "./util";
import { validateTasks } from "./validate";

export function plan(tasks: ITask[]): void {
    if (localStorage) {
        gStorage = localStorage;
    } else {
        gStorage = cookieStorage;
    }

    validateTasks(tasks);
    gTasks = tasks;
    gTasks.forEach(task => {
        setUpTriggers(task);
    });
}

export function lastExecuted(task: string): Date | undefined {
    const tasks = gTasks.filter(t => t.name === task);
    if (tasks.length) {
        return getLastExec(tasks[0]);
    }
    return undefined;
}

let gTasks: ITask[];
let gStorage: IStorage;

function setUpTriggers(task: ITask): void {
    if (!task.actions || !task.actions.length) { return; }
    task
        .triggers
        .forEach(trigger => {
            if (!planed(task, trigger)) {
                return;
            }
            if (trigger.on === "init") {
                setUpTimerActions(
                    task,
                    trigger,
                    trigger.timeout || 0,
                    trigger.repeat || 0,
                );
            }
        });
}

function getLastExec(task: ITask): Date | undefined {
    const d = Number(gStorage.getItem("task:" + task.name));
    if (d) {
        return new Date(d);
    }

    return undefined;
}

function setUpTimerActions(task: ITask, trigger: ITrigger, timeout: number = 0, repeat: number = 0): void {
    const action = () => {
        if (trigger.check && !trigger.check(task.name)) {
            return;
        }
        task.actions.forEach(t => t());
        gStorage.setItem("task:" + task.name, (new Date()).getTime().toString());
    };
    setTimeout(() => {
        action();
        if (repeat) {
            setInterval(action, repeat);
        }
    }, timeout);
}

function planed(task: ITask, trigger: ITrigger): boolean {
    const lastExec = getLastExec(task);
    if (trigger.plan) {
        if (trigger.plan === "once") {
            if (lastExec) {
                return false;
            }
            return true;
        }
        let interval: number;
        if (typeof trigger.plan === "object") {
            interval = trigger.plan[0] * intervalToMilliseconds(trigger.plan[1]);
        } else {
            interval = intervalToMilliseconds(trigger.plan as IntervalTypes);
        }
        if (lastExec && ((Date.now() - lastExec.getTime()) < interval)) {
            return false;
        }
    }
    return true;
}
