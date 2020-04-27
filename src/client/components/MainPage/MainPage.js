import React, {Component} from "react"
import {connect} from "react-redux"
import NavBar from './MainPageComponents/NavBar/NavBar'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import Settings from './MainPageComponents/Users/Settings/Settings'
import UserReviews from "./MainPageComponents/Users/UserReviews/UserReviews"
import UsersReviews from "./MainPageComponents/Users/UserReviews/UsersReviews"
import RestaurantReviews from './MainPageComponents/Restaurant/RestaurantReviews'
import Reviews from './MainPageComponents/Review/ReviewForm'
import EditReviewForm from './MainPageComponents/Review/EditReviewForm'
import UsersInfo from './MainPageComponents/Users/UsersInfo/UsersInfo'
import Restaurants from './MainPageComponents/Restaurant/Restaurants'

import './MainPage.scss'


class MainPage extends Component {

    render() {
        return (
               <Router>
                    <NavBar/>
                    <Switch>
                        <Route exact path="/" component={Restaurants}/>
                        <Route exact path="/settings" component={Settings}/>
                        <Route exact path="/users" component={UsersInfo}/>
                        <Route exact path="/review" component={Reviews}/>
                        <Route exact path="/myReviews" component={UserReviews}/>
                        <Route exact path="/reviews/:user_name" component={UsersReviews}/>
                        <Route exact path="/editreview" component={EditReviewForm}/>
                        <Route exact path="/:restaurant_name" component={RestaurantReviews}/>

                    </Switch>
                </Router>
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
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
