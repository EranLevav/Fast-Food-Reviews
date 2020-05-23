const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: ''
  },
  user_name: {
    type: String,
    default: ''
  },
  is_external_acc: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  avatar_url:{
    type: String,
    default: ''
  },
    creation_date: {
    type: Date,
    default: Date.now()
  }
});
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('UserModel', UserSchema);
