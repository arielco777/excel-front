const checkEnv = (name: string) => {
    if (typeof import.meta.env[name] == "undefined") {
        throw new Error(`Variable ${name} undefined`);
    }
    return import.meta.env[name];
};

export { checkEnv };
