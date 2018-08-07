import React, { Component } from 'react';
import Loader1 from '../../../resources/ui/loader1.svg'
import Loader2 from '../../../resources/ui/loader2.svg'

class Loader extends Component {

    render() {
        return (
            <div className="loading_container">
                <div className="loading">
                    <div className="loading__ring">
                        <Loader1/>
                    </div>
                    <div className="loading__ring">
                        <Loader2/>
                    </div>
                </div>
            </div>
        );
    }

}

export default Loader;