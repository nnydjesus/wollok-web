
function pointerEvents(kind) {
    return ["pointer", "mouse"].map((alternative) => alternative + kind);
}

export function isEventOfKind(kind, event) {
    return pointerEvents(kind).indexOf(event.data.originalEvent.type) !== -1
}

export function isPointerMove(event) {
    return isEventOfKind('move', event);
}

export function isPointerDown(event) {
    return isEventOfKind('down', event);
}

export function isPointerUp(event) {
    return isEventOfKind('up', event);
}