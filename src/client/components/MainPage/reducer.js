import initialState from '../../initialState'
import {MainActionsConstants} from './constants.js'
import { arrayBufferToUrl } from '../../utils/ImageHandler'

const MainReducer = (state = initialState.main, action) => {
    console.log('MainReducerState=', state);
    console.log('RECEIVED ACTION: ' + action.type, action);

    switch (action.type) {
        case MainActionsConstants.LOADֹֹֹ_USER_PROFILES_SUCCESS:
            let res = action.payload.users.map(elm => {
                var avatar = elm.avatar;
                var is_external_acc = elm.is_external_acc;
                if (is_external_acc)
                    avatar = elm.avatar_url;
                else if (avatar && avatar.data)
                    avatar = arrayBufferToUrl(avatar.data.data);
                return {
                    user_name: elm.user_name,
                    location: elm.location,
                    avatar: avatar
                }
            });
            return state.set('user_profiles', res);


        case MainActionsConstants.SET_SEARCH_VALUE:
            if (action.payload.search_by === 'location') {
                return state
                    .set('search_by_location_value', action.payload.value);
            }
            if (action.payload.search_by === 'name') {
                return state
                    .set('search_by_name_value', action.payload.value);
            }
            return state;  
                            
        case MainActionsConstants.LOADֹֹֹ_USER_REVIEWS_SUCCESS:
            return state.set('user_reviews', action.payload.user_reviews);
         
        case MainActionsConstants.LOADֹֹֹ_RESTAURANT_REVIEWS_SUCCESS:
            return state.set('restaurant_reviews', action.payload.restaurant_reviews); 

        case MainActionsConstants.ADD_REVIEW:
            var addReviewByRestaurantName = {
                restaurant_name: action.payload.restaurant_name,
            }
            return state.set('addReviewByRestaurantName', addReviewByRestaurantName); 

        case MainActionsConstants.DATA_EDIT_REVIEW:
            const review = action.payload.review;
            var review_data = {
                review_id: review._id,
                bathroom_quality: review.topics.bathroom_quality,
                staff_kindness: review.topics.staff_kindness,
                cleanliness: review.topics.cleanliness,
                drive_thru_quality: review.topics.drive_thru_quality,
                delivery_speed: review.topics.delivery_speed,
                food_quality: review.topics.food_quality,
                restaurant_name: review.restaurant_name,
                comment: review.comment,
            } 
            return state.set('data_edit_review', review_data);

        case MainActionsConstants.SET_REVIEWS_BY_USER_NAME: //todo: change set to search
            return state.set('reviews_by_user_name', action.payload.user_name);

        case MainActionsConstants.SEARCH_REVIEWS_BY_RESTAURANT_NAME: //todo: change set to search
            return state.set('reviews_by_restaurant_name', action.payload.restaurant_name);    
    
        default: //otherwise state is lost!
            return state;
    }
};

export default MainReducer
