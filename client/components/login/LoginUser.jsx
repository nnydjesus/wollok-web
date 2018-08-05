import React from 'react';
import PropTypes from 'prop-types';

const LoginUser = (props) => (
    <a className="user clearfix" href="#" onClick={props.selectUser ? props.selectUser : () => {}}>
        <div className="avatar" 
             style={{background: `url('${props.avatar ? props.avatar : '/public/user-avatar.svg'}') no-repeat center center`, backgroundSize: 'cover'}}>
            <div className="user-info"><h2>{props.name}</h2>
                <span>{props.email}</span></div>
        </div>
    </a>
);

LoginUser.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    selectUser: PropTypes.func
};

export default LoginUser;