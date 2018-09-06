export declare type IAction = () => any;
export interface ITrigger {
    on: TriggerTypes;
    timeout?: number;
    repeat?: number;
    plan?: "once" | IntervalTypes | [number, IntervalTypes];
    check?: (task?: string) => boolean;
}
export interface ITask {
    name: string;
    actions: IAction[];
    triggers: ITrigger[];
}
export declare type IntervalTypes = "second" | "minute" | "hour" | "day" | "week";
export declare type TriggerTypes = "init";
export interface IStorage {
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
}
//# sourceMappingURL=types.d.ts.map