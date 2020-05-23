const multer = require('multer');
const fs = require('fs');
const Review = require('../model/review');
const { serverError, clientError, successResponse } = require('../utils/serverResponses');


// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = 'uploads';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

module.exports = (app) => {

    /*
    * req: Save a restaurant review
    */
    app.post('/api/review/add_review', upload.array('files', 10), (req, res, next) => {
        try {
            const {body, files} = req;
            const {
                user_name,
                restaurant_name,
                bathroom_quality,
                staff_kindness,
                cleanliness,
                food_quality,
            } = body;

            console.log(body);
            console.log(files);

            const pictures = files ? req.files.map((file) => {
                var data = fs.readFileSync(file.path);
                var contentType = 'image/jpeg';
                return {data: data, contentType: contentType};
            }) : [];

             console.log(pictures);

            const drive_thru_quality = body.drive_thru_quality ? body.drive_thru_quality : 0;
            const delivery_speed = body.delivery_speed ? body.delivery_speed : 0;
            const comment = body.comment ? body.comment : '';

            // validate request
            if (!user_name || !restaurant_name || !bathroom_quality || !staff_kindness || !cleanliness || !food_quality)
                return clientError(res, 'Error: one of the following fields are blank: ');


            // save review
            console.log('saving review');

            var newReview = new Review();
            newReview.user_author = user_name;
            newReview.restaurant_name = restaurant_name;
            newReview.pictures = pictures;
            newReview.topics = {
                bathroom_quality: bathroom_quality,
                staff_kindness: staff_kindness,
                cleanliness: cleanliness,
                drive_thru_quality: drive_thru_quality,
                delivery_speed: delivery_speed,
                food_quality: food_quality
            };
            newReview.comment = comment;

            newReview.save((err, review) => {
                if (err) {
                    console.error(err);
                    return serverError(res);
                }
                console.log('saved successfully');
                console.log(review);
                // validation succeeded, create token
                return successResponse(res, review);
            });
        } catch (err) {
            console.error(err);
            return serverError(res);
        }
    });

    /*
    * req: Load all user reviews
    */

    app.get('/api/review/load_user_reviews', (req, res) => {

        const {query} = req;
        const {user_name} = query;
        console.log(`Load all ${user_name} reviews`);

        try {
            //find all user reviews
            Review.find({
                user_author: user_name,
            } , (err, user_reviews) => {
                if (err) {
                    console.error(err);
                    return serverError(res);
                }

                console.log(user_reviews);
                console.log(`get ${user_name} reviews succeeded, returns the reviews`);
                return successResponse(res, user_reviews);
            });
        } catch (err) {
            console.error(err);
            return serverError(res);
        }
    });

     /*
    * req: Load all user reviews
    */

    app.get('/api/review/load_restaurant_reviews', (req, res) => {

        const {query} = req;
        const {restaurant_name} = query;
        console.log(`Load all ${restaurant_name} reviews`);

        try {
            //find all user reviews
            Review.find({
                restaurant_name: restaurant_name,
            } , (err, restaurant_reviews) => {
                if (err) {
                    console.error(err);
                    return serverError(res);
                }

                console.log(restaurant_reviews);
                console.log(`get ${restaurant_name} reviews succeeded, returns the reviews`);
                return successResponse(res, restaurant_reviews);
            });
        } catch (err) {
            console.error(err);
            return serverError(res);
        }
    });

    /*
    * header: Delete user review
    */
    app.post('/api/review/delete_review', (req, res, next) => {
        const {body} = req;
        const {review_id} = body;
        console.log(`review_id: ${review_id} to delete`);
        try {
            Review.deleteOne({
                _id: review_id,
                }, (err) => {
                if (err) {
                    console.error(err);
                    return serverError(res);
                }

                console.log(`deleting review ${review_id}`);
                const data = {success: true, message: 'Delete review successfully'};
                return successResponse(res, data);
             });
        } catch (err) {
            console.error(err);
            return serverError(res);
        }
    });

    //Todo edit photo!!
    app.post('/api/review/edit_review', (req, res, next) => {

        const update_query = {"_id": `${req.body.review_id}`};

        try{
            const { body } = req;
            const { bathroom_quality,
                    staff_kindness,
                    cleanliness,
                  } = body;
    
            console.log('Edit review with the new data:');
            console.log(body);

            // validate request
            if (!bathroom_quality && !staff_kindness && !cleanliness)
                return clientError(res, 'Error: all of the following fields are blank: bathroom_quality, staff_kindness, cleanliness');

            //prepering update values for editing user profile
            var update_values={"$set": {}};
            for (let [key, value] of Object.entries(body)) {
                console.log(`${key}: ${value}`);
                if (key === "restaurant_name" || key === "comment")
                    update_values["$set"][`${key}`] = `${value}`;
                else
                    update_values["$set"][`topics.${key}`] = `${value}`;
            }

            console.log('Update values:' , update_values);
            console.log('update query:' , update_query);

            Review.updateOne(update_query , update_values)
                .then(result => {
                    const { n, nModified } = result;
                    console.log('result values:' , result);
                    if(n && nModified) {
                        console.log(`Successfully update user review of ${body.review_id}.`)
                        //find review by review_id
                        Review.find(update_query , (err, reviews) => {
                            if (err) {
                                console.error(err);
                                return serverError(res);
                            }

                            if (reviews.length > 1) {
                                console.error('Error: more than 1 review with the same ID in the db!!!');
                                return serverError(res);
                            }

                            if (reviews.length === 0) {
                                return clientError(res, 'Error: review is incorrect');
                            }
                            return successResponse(res,reviews[0]);
                        });
                    }
                    else {
                        return clientError(res, 'Failed to edit user review, review id is incorrect');
                    }
                })
                .catch(err => console.error(`Failed to edit user review, Error: ${err}`))
                }
                
        catch(err){
            console.error(err);
            return serverError(res);
        }
    });   
}
