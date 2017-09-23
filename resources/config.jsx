// Default app config
if (typeof window === 'undefined') {
    global.__CONFIG__ = {
        apiHost: "http://localhost:8080/passtosalesportal",
        logentriesNodeToken: "6eb9340d-79ca-44bd-9291-0fdee9b103b2",
        logentriesRestToken: "59a2386e-49cb-4a87-bfef-6f2b2349fd0a",
        timeZone: "America/Argentina/Buenos_Aires"
    };

    // Environment-related config
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
    global.__CONFIG__.environment = env;

    switch (env) {
        case "preprod":
            break;
        case "production":
            global.__CONFIG__.apiHost = "https://api.boletius.com";
            global.__CONFIG__.logentriesNodeToken = "e23e8002-692b-4209-8e0c-4787c09fc32e";
            global.__CONFIG__.logentriesRestToken = "95e5673e-ee9b-422a-bb49-5c80c1b8d44f";
            break;
    }
}