import {MainActionsConstants} from './constants.js';

function loadUserProfiles(name, location) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_USER_PROFILES,
        uri: `/api/profile/load_user_profiles?name=${name}&location=${location}`,
    }
}

function loadUserProfilesSuccess(users) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_USER_PROFILES_SUCCESS,
        payload: {
            users: users
        }
    }
}

function setSearchField(searchBy, value) {
    return {
        type: MainActionsConstants.SET_SEARCH_VALUE,
        payload: {
            search_by: searchBy,
            value: value
        }
    }
}

function submitReview(values, user_name, resetCallbck) {
    return {
        type: MainActionsConstants.SUBMIT_REVIEW,
        uri: '/api/review/add_review',
        payload: {
            form_values: values,
            user_name: user_name
        },
        callback: resetCallbck,
    }
}

function editUserProfile(data) {
    return {
        type: MainActionsConstants.EDIT_USER_PROFILE,
        uri: '/api/profile/edit_user_profile',
        payload: {
            data: data
        }
    }
}

function clearAvatarPreview() {
    return {
        type: MainActionsConstants.CLEAR_AVATAR_PREVIEW,
    }
}

function loadUserReviews(user_name) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_USER_REVIEWS,
        uri: `/api/review/load_user_reviews?user_name=${user_name}`,
    }
}

function loadUserReviewsSuccess(user_reviews) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_USER_REVIEWS_SUCCESS,
        payload: {
            user_reviews: user_reviews
        }
    }
}

function loadRestaurantReviews(restaurant_name) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_RESTAURANT_REVIEWS,
        uri: `/api/review/load_restaurant_reviews?restaurant_name=${restaurant_name}`,
    }
}

function loadRestaurantReviewsSuccess(restaurant_reviews) {
    return {
        type: MainActionsConstants.LOADֹֹֹ_RESTAURANT_REVIEWS_SUCCESS,
        payload: {
            restaurant_reviews: restaurant_reviews
        }
    }
}

function addReview(restaurant_name) {
    return {
        type: MainActionsConstants.ADD_REVIEW,
        payload: {
            restaurant_name: restaurant_name
        }
    }
}

function deleteReview(review_id) {
    return {
        type: MainActionsConstants.DELETE_REVIEW,
        uri: '/api/review/delete_review',
        payload: {
            review_id: review_id
        }
    }
}

function dataEditReview(review) {
    return {
        type: MainActionsConstants.DATA_EDIT_REVIEW,
        payload: {
            review: review
        }
    }
}

function editReview(review){
    return {
        type: MainActionsConstants.EDIT_REVIEW,
        uri: '/api/review/edit_review',
        payload: {
            review: review
        }
    }
}

function setReviewsByUsername(user_name) { // change to seearch
    return {
        type: MainActionsConstants.SET_REVIEWS_BY_USER_NAME,
        payload: {
            user_name: user_name,
        }
    }
}

function searchReviewsByRestaurantName(restaurant_name) { // change to seearch
    return {
        type: MainActionsConstants.SEARCH_REVIEWS_BY_RESTAURANT_NAME,
        payload: {
            restaurant_name: restaurant_name,
        }
    }
}


let MainActions = {
    loadUserProfiles,
    loadUserProfilesSuccess,
    setSearchField,
    submitReview,
    editUserProfile,
    clearAvatarPreview,
    loadUserReviews,
    loadUserReviewsSuccess,
    loadRestaurantReviews,
    loadRestaurantReviewsSuccess,
    addReview,
    deleteReview,
    dataEditReview,
    editReview,
    setReviewsByUsername,
    searchReviewsByRestaurantName,
};

export default MainActions
