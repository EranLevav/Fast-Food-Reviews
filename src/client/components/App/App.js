import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loader-spinner'
import MainPage from "../MainPage/MainPage"
import SnackActions from '../SnackBar/actions'
import SnackBar from '../SnackBar/snackBar'
import { LoginPage } from "../Login"
import AppActions from "../App/actions"
import { getFromStorage } from '../../utils/storage'
import './App.scss';

class App extends Component {

    componentDidMount() {
        //Upon initial login, we will validate whether the user has a token
        const obj = getFromStorage('fast_food_reviews');
        if (obj && obj.token) {
            const { token } = obj;
            this.props.verifyTokenActionEventHandler(token);
        }
        else {
            console.log("You are not connected");
            this.props.closeLoading();
        }

    }
    render() {
        return (
            <div>
                <div className="logo-site" />
                {this.props.isLoading ?
                    <Loader className="loader" type="Oval" color="Blue" /> :
                    <div>
                        <div className="root-container">
                            {this.props.token ? <MainPage /> : <LoginPage />}

                        </div>
                        <SnackBar openSnackBar={this.props.openSnackBar}
                            closeSnackBar={this.props.closeSnackBar}
                            snack_isSucc={this.props.snack_isSucc}
                            snack_message={this.props.snack_message}
                            display_snack={this.props.display_snack}
                        />
                    </div>}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        token: state['login'].get('token'),
        isLoading: state['login'].get('isLoading'),
        snack_message: state['snackBar'].get('snack_message'),
        snack_isSucc: state['snackBar'].get('snack_isSucc'),
        display_snack: state['snackBar'].get('display_snack'),
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        openSnackBar: (isSucc, message) => {
            dispatch(SnackActions.openSnackBar(isSucc, message));
        },
        closeSnackBar: () => {
            dispatch(SnackActions.closeSnackBar());
        },
        verifyTokenActionEventHandler: (token) => {
            dispatch(AppActions.verifyTokenAction(token));
        },
        closeLoading: () => {
            dispatch(AppActions.closeLoadingScreen());
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);