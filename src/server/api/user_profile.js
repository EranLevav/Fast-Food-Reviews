const multer = require('multer');
const fs = require('fs');
const User = require('../model/user');
const Review = require('../model/review');
const { clientError, successResponse } = require('../utils/serverResponses');
const { succLoginResponse  } = require('../utils/loginHelpers');

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
    * req: each user will have the ability to view other users profile
    */
    app.get('/api/profile/load_user_profiles', (req, res) => {

        const {query} = req;
        const {name, location} = query;
        const user_name = name? name : '';
        const user_location = location ? location : '';

        console.log(`name is: ${user_name}, location is: ${user_location}`);
        const find_query = {
            user_name: {
                $regex: user_name,
                '$options': 'i'
            },
            location: {
                $regex: user_location,
                '$options': 'i'
            }
        };

        try {
            //find all users
            User.find(find_query, null, {sort: {'date': -1}, limit: 20}, (err, users) => {
                if (err) {
                    console.error(err);
                    return serverError(res);
                }

                const user_profiles = users.map(user => (
                    {
                        user_name: user.user_name,
                        location: user.location,
                        avatar: user.avatar,
                        avatar_url: user.avatar_url,
                        is_external_acc: user.is_external_acc
                    }
                ));
                console.log(user_profiles);
                console.log('get succeeded, returns all other users profile');
                return successResponse(res, user_profiles);
            });
        } catch (err) {
            console.error(err);
            return serverError(res);
        }
    });

    /*
    * req: Each user will have the ability to modify own profile properties
    */
    app.post('/api/profile/edit_user_profile', upload.single('new_avatar'), (req, res, next) => {

        const update_query = {"user_name": `${req.body.user_name}`};

        try{

            const { body, file } = req;
            const { new_user_name,
                    new_location,
                  } = body;

            const avatar_path = file ? file.path : '';

            // validate request
            console.log('edit_user_profile');
            console.log(avatar_path);
            console.log(body);

            if (new_user_name) {
                // validate new user-name doesn't exist in the DB
                try {
                    User.find({
                        user_name: new_user_name
                    }, (err, users) => {
                        if (err) {
                        console.error(err);
                        return serverError(res);
                        }

                        if (users.length !== 0) {
                        console.error(`user name: ${new_user_name} allready exist in the db!!!`);
                        return serverError(res);
                        }
                    });
                } catch(err){
                    console.error(err);
                    return serverError(res);
                }
            }

            if (!new_user_name && !new_location && !file )
                return clientError(res, 'Error: all of the following fields are blank: new_user_name, new_location, file');

            //prepering update values for editing user profile
            var update={"$set": {}};
            if(new_user_name){
                update["$set"]["user_name"] = `${new_user_name}`
            }
            if(new_location){
                update["$set"]["location"] = `${new_location}`
            }
            if(avatar_path){
                update["$set"]["avatar"] = `${avatar_path}`
            }
            //update values
            console.log('update to values:' , update);
            console.log('update user query:' , update_query);

            User.updateOne(update_query,update)
                .then(result => {
                    const { n, nModified } = result;
                    console.log('result values:' , result);
                    if(n && nModified) {
                        console.log(`Successfully update user profile of ${body.user_name}.`);
                        if(new_user_name) { 
                            console.log('Updating user author of all user reviews.');
                            const new_user_author = new_user_name;
                            const old_user_author = body.user_name; 
                            try {
                                Review.updateMany({"user_author": `${old_user_author}`},
                                                  { $set: {"user_author": `${new_user_author}`}})
                                                  .then(result => {
                                                    const { n, nModified } = result;
                                                    console.log('result user author update:' , result);
                                                    if(n && nModified) {
                                                        console.log('Successfully update user author.');
                                                    }
                                                }
                                        
                                );
                            } catch(err){
                                console.error(err);
                                return serverError(res);
                            }
                        }
                        //find user by user_name and return data to fronted
                        const find_query =  new_user_name ? new_user_name : body.user_name;
                        User.find({"user_name":`${find_query}`} , (err, users) => {
                            if (err) {
                                console.error(err);
                                return serverError(res);
                            }
                            if (users.length >1) {
                                console.error('Error: more than 1 user with the same ID in the db!!!');
                                return serverError(res);
                            }
                            if (users.length === 0) {
                                return clientError(res, 'Error: username is incorrect');
                            }
                            return succLoginResponse(users[0],res);
                        });
                    }
                    else {
                        return clientError(res, 'Failed to update user profile, username is incorrect');
                    }
                })
                .catch(err => console.error(`Failed to update user profile, Error: ${err}`))
                }
        catch(err){
            console.error(err);
            return serverError(res);
        }
    });   
};