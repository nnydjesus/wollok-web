// Default app config
if (typeof window === 'undefined') {
    global.__CONFIG__ = {
        timeZone: "America/Argentina/Buenos_Aires"
    };
    // Environment-related config
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
    global.__CONFIG__.environment = env;
}
