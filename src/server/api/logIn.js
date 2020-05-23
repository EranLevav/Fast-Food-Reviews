const multer = require('multer');
const fs = require('fs');
const UserModel = require('../model/user');
const UserSession = require('../model/userSession');
const { isUnique, isExist,isAlreadyExists, isRequestValid ,validPassword} = require('../utils/validate');
const { serverError, successResponse,infoResponse } = require('../utils/serverResponses');
const { getUserJson, getFacebookName, createNewUser, succLoginResponse } = require('../utils/loginHelpers');

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

module.exports = (logIn) => {
  /*
    req: {user_name: str, password: str, avatar: file, location: string}
  */
  logIn.post('/api/account/signup', upload.single('avatar'), (req, res) => {
    console.log('Api request: /api/account/signup');
    try {
      const { body, file } = req;
      const { password, user_name, location } = body;
      const avatar_path = file ? file.path : '';
      if (!isRequestValid({ user_name, location, password }, res)) return;
      UserModel
        .find({ user_name: user_name })
        .then(users => {
          if (isAlreadyExists(users,res)) return;
          let newUser = new UserModel();
          newUser = createNewUser(newUser, user_name, user_name, newUser.generateHash(password), location, false, avatar_path);
          if (!newUser) {
            return serverError(res);
          }
          newUser
            .save(newUser)
            .then(() => {
              console.log(`created ans saved new user in db:\n ${newUser}`);
              return succLoginResponse(newUser, res);
            })
        });
    }catch (err) {
      console.log(err);
      return serverError(res);
    }
  });

  /*
    req: {user_name: str, password: str}
  */
  logIn.post('/api/account/signin', (req, res) => {
    console.log('Api request: /api/account/signin');
    try {
      const { user_name, password } = req.body;
      if (!isRequestValid({ user_name, password }, res)) return;
      UserModel
        .find({ user_name: user_name })
        .then(users => {
          if (!isUnique(users, res) || !isExist(users, res)) return;
          const user = users[0];
          if(!validPassword(user,password,res)) return;
          console.log('validation succeeded, creating token');
          return succLoginResponse(user, res);
        });
    }catch (err) {
      console.error(err);
      return serverError(res);
    }
  });

  /*
    req: {user_name: str, password: str , email: str}
  */
  logIn.post('/api/account/signin_ext_acc', (req, res) => {
    console.log('Api request: /api/account/signin_ext_acc');
    try {
      const { user_id, email, avatar } = req.body;
      if (!isRequestValid({user_id, email, avatar}, res)) return;
      //find user by user_id, then, if not found him, sign up new user
      UserModel
        .find({ user_id: user_id })
        .then(users => {
          if (!isUnique(users, res)) return;
          let isNewUser = users.length === 0;
          if (isNewUser) {
              let newUser = new UserModel();
              newUser = createNewUser(newUser, getFacebookName(email), user_id, '', "google_maps_location",
                                      true, null, avatar);
              if (!newUser) return serverError(res);
              newUser
                .save(newUser)
                .then(() => {
                  console.log(`created and saved new external user in db:\n ${newUser}`);
                  return succLoginResponse(newUser, res);
                })
          }else {
            console.log('external user exists, logging in');
            const user = users[0];
            return succLoginResponse(user, res);
          }
        });
    }catch (err) {
      console.error(err);
      return serverError(res);
    }
  });

  /*
    req: {user_name: str}
  */
  logIn.get('/api/account/is_user_name_exist', (req, res) => {
    console.log('Api request: /api/account/is_user_name_exist');
    try {
      const { name } = req.query;
      if (!name) return;
      const user_name = name;
      const find_query = {
        user_name: {
          $regex: user_name,
          '$options': 'i'
        },
      };
      UserModel
        .find(find_query, { user_name: 1, _id: 0 }, { sort: { 'date': -1 }, limit: 20 })
        .then(users => {
          const users_names = users.map(user => user.user_name);
          console.log(`fetch all users-names succeeded: \n ${users_names}`);
          return successResponse(res, users_names);
        });
    }catch (err) {
      console.error(err);
      return serverError(res);
    }
  });

  /*
    header: token: str
  */
  logIn.get('/api/account/verify?', (req, res) => {
    console.log(`Api request: ${req.url}`);
    const { token } = req.query;
    // Verify the token is one of a kind and it's not deleted.
    UserSession
      .find({ _id: token, })
      .then(sessions => {
        if (sessions.length !== 1) {
          console.log('Invalid session, the user does not have a token,must login/register');
          return infoResponse(res);
        }
        UserModel
          .find({_id: sessions[0].userId})
          .then(users => {
            if (!isUnique(users, res) || !isExist(users, res)) return;
            let user = users[0];
            let userData = getUserJson(user, token);
            return successResponse(res, userData)
          });
      })
      .catch((err) => {
        console.error(err);
        return serverError(res);
      });
  });

  /*
    header: token: str
  */
  logIn.post('/api/account/logout', (req, res) => {
    console.log('Api request: /api/account/logout');
    const { token } = req.query;
    UserSession
      .deleteOne({_id: token,})
      .then(() => {
          const data = { success: true, message: 'logged out successfully' };
          return successResponse(res, data);
      })
      .catch((err) => {
        console.error(err);
        return serverError(res);
      });
  });

};
