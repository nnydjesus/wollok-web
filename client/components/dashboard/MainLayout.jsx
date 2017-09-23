import React, {Component, PropTypes} from 'react';

class MainLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        this.props.router.push('/app/ide/');
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default MainLayout;
