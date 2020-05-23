import React, {Component} from "react"
import {connect} from "react-redux"
import MainActions from "../../../actions"
import ReviewCard from "../../Review/ReviewCard"
import AppActions from "../../../../App/actions"
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import './UserReviews.scss'

class UserReviews extends Component {

    componentDidMount() { 
        this.props.OpenLoadingScreen();
        this.props.loadUserReviewsEventHandler(this.props.user_name);
    }
    //TODO: style h1 element
    render() {
        return (
            <div className="reviews-content">
                <div className="reviews-header">Manage your Reviews</div>    
             {console.log('test user reviews')}
             {console.log(this.props.user_reviews)}
             {this.props.isLoading ? 
                <Loader className="loader" type="Oval" color="Blue"/> :
                this.props.user_reviews.length > 0 ? 
                    <ReviewCard user_reviews={this.props.user_reviews}
                                permission={true}
                                history={this.props.history}
                                onDelete={(review_id) => this.props.deleteReviewEventHandler(review_id, this.props.user_name)}
                                onEdit={(review) => this.props.editReviewEventHandler(review)}/> 
                    : 
                <div>
                    <h2 style={{paddingTop: "10px"}}> You haven't written any reviews yet... </h2>
                    <div className="center" style={{paddingTop: "25px",paddingBottom:"15px"}}> 
                        <Link className="btn" to="/review"> Write first review </Link>
                    </div>
                </div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user_name: state['login'].get('user_name'),
        user_reviews: state['main'].get('user_reviews'),
        isLoading: state['app'].get('isLoading'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        OpenLoadingScreen: () => {
            dispatch(AppActions.OpenLoadingScreen());
        },
        loadUserReviewsEventHandler: (user_name) => {
            dispatch(MainActions.loadUserReviews(user_name));
        },
        deleteReviewEventHandler: (review_id,user_name) => {
            {console.log('test user delete' , user_name)}
            dispatch(MainActions.deleteReview(review_id));
            dispatch(MainActions.loadUserReviews(user_name));
        },
        editReviewEventHandler: (review) => {
            dispatch(MainActions.dataEditReview(review));
        },
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(UserReviews);
