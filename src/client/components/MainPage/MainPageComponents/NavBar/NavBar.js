import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getFromStorage} from '../../../../utils/storage'
import LoginActions from '../../../Login/actions'
import Avatar from '@material-ui/core/Avatar/index'
import {Link} from 'react-router-dom'

import './NavBar.scss'

class NavBar extends Component {

    signOut = () => {
        const obj = getFromStorage('fast_food_reviews');
        if (obj && obj.token) {
            const {token} = obj;
            this.props.signOutEventHandler(token);
            //   <Redirect to='/login'/>;
        }
    };

    render() {
        return (
            <div className="nav">
                <div className="dropdown">
                    <div className="nav-item">
                        <Avatar src={this.props.avatar}style={{ margin: "10px", width: "30px", height: "32px"}}/>
                        {this.props.user_name}
                    </div>    
                    <div className="dropdown-content">
                        <Link className="dropdown-content-item" to="/myreviews">My reviews</Link>
                        <Link className="dropdown-content-item" to="/settings">Settings</Link>
                        <Link className="dropdown-content-item" to="/" onClick={this.signOut}>Sign Out</Link>
                    </div>
                </div>
                <Link className="nav-item" to="/">Home</Link>
                <Link className="nav-item" to="/users">Users</Link>
                <Link className="nav-item" to="/review">Write a review</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user_name: state['login'].get('user_name'),
        location: state['login'].get('location'),
        avatar: state['login'].get('avatar'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signOutEventHandler: (token) => {
            dispatch(LoginActions.signOutAction(token));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
