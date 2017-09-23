import React, { Component, PropTypes } from 'react';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { Translate } from 'react-redux-i18n';

class App extends Component {
    constructor(props) {
        super(props);
    }

    backToMain = () => {
        this.props.router.push("/app/ide");
    };

    render() {
        return (
            <div>
                <div id={this.props.name + "-content"} className="app-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    theme: PropTypes.object,
    name: PropTypes.string,
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rightPanel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onRightIconClick: PropTypes.func,
    router: PropTypes.object
};

export default App;