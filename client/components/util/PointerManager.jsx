
let PointerManager = {

    buttonState: 0,

    updateButtonState: function (ev) {
        if (typeof ev.buttons === "undefined") {
            // Safari does not have Event.buttons - map to Event.which
            if (ev.type === "mouseup" || ev.type === "pointerup") {
                let newButtonState = this.buttonState - ev.which;
                this.buttonState = (newButtonState > 0 ? newButtonState : 0);
            } else {
                this.buttonState = ev.which;
            }
            return;
        }
        this.buttonState = ev.buttons;
    },

    handleMouseDown: function(ev) {
        this.updateButtonState(ev);
    },

    handleMouseUp: function(ev) {
        this.updateButtonState(ev);
    },

    registerEvents: function(){
        window.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
        window.addEventListener('mouseup', this.handleMouseUp.bind(this), true);
    },

    isButtonPressed(button, event) {
        if(event) {
            this.updateButtonState(event);
        }
        return this.buttonState & button;
    },

    LEFT_BUTTON: 1,
    RIGHT_BUTTON: 2,
    MIDDLE_BUTTON: 4

};

if(window) {
    PointerManager.registerEvents();
}

export default PointerManager
