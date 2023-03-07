export declare function init(): Promise<void>;
export declare function stop(): Promise<void>;
export declare function build(): Promise<string>;
export declare function cli(): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
}>;
