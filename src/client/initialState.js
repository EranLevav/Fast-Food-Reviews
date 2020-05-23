const { Map } = require('immutable');

export default {
    app: Map({
      // tags: List(),
      isSignInOpen: true,
      isRegisterOpen: false,
      isLoading: false,
    }),
    login: Map({
      user_names: [],
      user_name:'',
      location:'',
      lat: '',
      lng: '',
      avatar:'/broken-image.jpg',
      avatar_preview: '/broken-image.jpg',
      token: '',
      isLoading: true,
      remember_me: false
    }),
    snackBar: Map({
        display_snack: false,
        snack_isSucc: true,
        snack_message: ''
    }),
    main: Map({
      user_profiles: [],
      user_reviews: [],
      restaurant_reviews: [],
      Bathroom_Quality: 0,
      search_by_name_value: '',
      search_by_location_value: '',
      submit_review_done: false,
      addReviewByRestaurantName:'',
      data_edit_review: [],
      reviews_by_user_name: '',
      reviews_by_restaurant_name: '', //todo change name
  }),
};
