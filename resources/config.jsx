// Default app config
if (typeof window === 'undefined') {
    global.__CONFIG__ = {
        apiHost: "http://localhost:3033",
        timeZone: "America/Argentina/Buenos_Aires"
    };

    // Environment-related config
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
    global.__CONFIG__.environment = env;

    switch (env) {
        case "local":
            break;
        case "production":
            global.__CONFIG__.apiHost = "https://wollok-server.herokuapp.com";
            break;
    }
}
