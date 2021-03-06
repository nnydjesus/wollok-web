import fetch from 'node-fetch';

export const API_HOST = (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.apiHost : global.__CONFIG__.apiHost);

function toQueryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export function apiFetch(getState, endpoint, { isBlob = false, isText = false, method = 'GET', params, body, headers } = {}) {
    const queryParams = params ? '?' + toQueryParams(params) : '';
    return fetch(`${API_HOST}/${endpoint}` + queryParams, {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ getState().login.authToken,
            ... headers
        },
        method,
        body: body && JSON.stringify(body),
    })
        .then(response => {
            if (response.status === 200) {
                if (isBlob) {
                    return response.blob();
                }
                if (isText) {
                    return response.text();
                }
                return response.json();
            } else if (response.status == 204 || response.status == 201) {
                return {};
            } else if (response.status === 500) {
                throw { id: "serverError", jsonResponse: response.json() };
            } else if (response.status === 403) {
                throw { id: "forbidden" };
            } else if (response.status === 404) {
                throw { id: "notFound" };
            } else if (response.status === 401 || response.status === 302) {
                throw { id: "authError" };
            } else if (response.status === 400) {
                throw {...response.json()};
            }
            throw { id: "defaultError" };
        });
}

export function apiGet(getState, endpoint, { params, headers } = {}) {
    return apiFetch(getState, endpoint, { params, headers })
}

export function apiGetBlob(getState, endpoint, { params, headers } = {}) {
    return apiFetch(getState, endpoint, { isBlob: true, params, headers })
}

export function apiPost(getState, endpoint, { params, body, headers } = {}) {
    return apiFetch(getState, endpoint, { method: 'POST', body, params, headers })
}

export function apiDelete(getState, endpoint, { params, body, headers } = {}) {
    return apiFetch(getState, endpoint, { method: 'DELETE', body, params, headers })
}

export function apiGetAsText(getState, endpoint, { params, headers } = {}) {
    return apiFetch(getState, endpoint, { isText: true,  params, headers })
}

export function apiPostAsText(getState, endpoint, { params, body, headers } = {}) {
    return apiFetch(getState, endpoint, { isText: true, method: 'POST', body, params, headers })
}

export function apiPut(getState, endpoint, { params, body, headers } = {}) {
    return apiFetch(getState, endpoint, { method: 'PUT', body, params, headers })
}
