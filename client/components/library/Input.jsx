import React from "react";
import PropTypes from "prop-types";

export default class Input extends React.Component {

    static FIELD_COUNT = 0;

    constructor(props) {
        super(props);
        this.index = Input.FIELD_COUNT++;
        this.state = {
            value: props.value?props.value:""
        };
    }

    setValue = (ev) => {
        if (typeof ev.target.value !== "undefined") {
            this.setState({value: ev.target.value});
            if (this.props.onChange) {
                this.props.onChange(ev.target.value);
            }
        }
    };

    getId = () => {
        return "inputField_" + this.props.field.replace(/[^a-zA-Z0-9]/, "") + "_" + this.index;
    };

    handleKeyPress = (ev) => {
        if (ev.key === "Enter" && this.props.onEnter) {
            this.props.onEnter()
        }
    };

    render = () => {
        return <div className={(this.props.groupClass!=undefined?this.props.groupClass: "form-group")  + (this.props.error ? " has-error" : "")}>
            {(this.props.error || this.props.helper) && <small className="form-text">{this.props.error || this.props.helper}</small>}
            <input type={this.props.type} className={this.props.className!=undefined?this.props.className: "form-control"} value={this.state.value} onChange={this.setValue} id={this.getId()} placeholder={this.props.placeholder} onKeyPress={this.handleKeyPress} autoFocus={this.props.focus?"true": "false"}/>
            <label htmlFor={this.getId()}>{this.props.label}</label>
        </div>;
    };

}

Input.propTypes = {
    value: PropTypes.string,
    field: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    helper: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};