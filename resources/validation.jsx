const emailRegex = /^([\w-]+(?:\.[\w-]+)*)(\+[\w\.-]+)?@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,63}(?:\.[a-z]{2})?)$/i

const existy = function (input) {
    if (typeof (input) === 'string') {
        return input.length > 0
    }
    return (input !== null && input !== undefined)
}

const regex = function (input, regex) {
    return regex.test(input)
}

const email = function (input) {
    return regex(input, emailRegex)
}

const rules = {
    login: {
        "username": [{rule: existy, error: "usernameEmpty"}, {rule: email, error: "usernameEmail"}],
        "password": [{rule: existy, error: "passwordEmpty"}]
    },
    forgotPassword: {
        "email": [{rule: existy, error: "emailEmpty"}, {rule: email, error: "emailNotValid"}]
    }
};

const validateField = (component, field, value) => {
    const fieldRules = rules[component][field];
    let error = "";
    for (let item of fieldRules) {
        if (error === "" && !item.rule(value)) {
            error = item.error;
        }
    }
    return component + ".error." + error;
};

export { validateField };