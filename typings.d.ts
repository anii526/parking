export {};
declare global {
    const __ENVIRONMENT__: {
        production: boolean;
        testing: boolean;
        development: boolean;
        current: "production" | "testing" | "development";
        commitHash: string;
        buildNumber: number;
    };
}
