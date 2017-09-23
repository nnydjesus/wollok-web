import React, { Component, PropTypes } from 'react';

class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className={this.props.className}>
            <div className="circle1 circle"></div>
            <div className="circle2 circle"></div>
            <div className="circle3 circle"></div>
            <div className="circle4 circle"></div>
            <div className="circle5 circle"></div>
            <div className="circle6 circle"></div>
            <div className="circle7 circle"></div>
            <div className="circle8 circle"></div>
            <div className="circle9 circle"></div>
            <div className="circle10 circle"></div>
            <div className="circle11 circle"></div>
            <div className="circle12 circle"></div>
        </div>);
    }
}

Spinner.propTypes = {
    className: PropTypes.string
};

export default Spinner;