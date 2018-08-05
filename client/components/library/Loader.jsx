import React, { Component } from 'react';

class Loader extends Component {

    render() {
        return (
            <div className="loader" style={this.props.style}>
                <span className="loader-animation load1"></span>
                <span className="loader-animation load2"></span>
                <span className="loader-animation load3"></span>
                <span className="loader-animation load4"></span>
                <span className="loader-animation load5"></span>
            </div>
        );
    }

}

export default Loader;