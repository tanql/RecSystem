var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// set up a mongoose model
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  facebookUserId: {
    type: String,
    unique: true
  },
  name: String,
  email: {type:String},
  image: String,
  interests: {type : {}, default: { herre: false,
    kvinne: false,
    sport: false,
    kids: false}},
  dateOfBirth: {type:Date},
  postCode:String,
  title: String,
  achievments: {},
  photos:[{
    name: String,
    garments: [mongoose.Schema.Types.ObjectId],
    store: String,
    taken: Date
  }],
  tryon_sessions:[{
    date: {type:Date},
    store: String,
    garments: [mongoose.Schema.Types.ObjectId]
  }],
  votes: []
});

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      if (user.password) {
        bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      } else {
        next();
      }
    });
  } else {
    return next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
