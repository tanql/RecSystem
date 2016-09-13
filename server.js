// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var request = require('request');
var path = require('path');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var fs    = require('fs');
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: __dirname + '/config/config.json' });

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('./config/user'); // get our mongoose model
var Garments = require('./src/photos/garments.schema');
var Receipt = require('./src/receipt/receipt.schemas');
var Vote = require('./src/vote/vote.schema');
var _ = require('underscore');

var fs = require('fs');

var passport    = require('passport');


require('./config/passport')(passport);
app.use(passport.initialize());

var isStartEvent = process.env.npm_lifecycle_event === 'start';
var fallbackPort = isStartEvent ? 8080 : 3000;
var port = (process.env.PORT || fallbackPort);
mongoose.connect(nconf.get('MONGODB_URI')); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// Serve static files (html, css, js) in /build ====================
// =================================================================

if (isStartEvent) {
    const buildPath = express.static(path.join(__dirname, 'build'));
    app.use('/', buildPath);
    app.use(express.static(path.join(__dirname, 'build')));
}

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------

var validateToken = passport.authenticate('jwt', { session: false });
var createToken = function (user) {
    var token = jwt.sign(user, nconf.get('JWT_PASSPORT_SECRET'), {
        expiresIn: 10080 // in seconds
    });
    return 'JWT ' + token;
};

var validateFacebookToken = function(access_token) {
    return new Promise((resolve, reject) => {
      var fields=['id','name','email','picture'];
      var qstr = `access_token=${access_token}&fields=${fields}`;
      request({
              url: 'https://graph.facebook.com/me?' + qstr
          },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log('facebook profile validated:');
                  console.log(body);
                  resolve(JSON.parse(body));
              } else {
                  console.log("request rejet");
                  reject(error);
              }
          }
      );
    });
};

var mergeFBUserWithExistingUser = function (fbUser, userId) {
  return new Promise((resolve, reject) => {
    var userData = {
      facebookUserId: fbUser.id,
      name: fbUser.name,
      image: fbUser.picture.data.url
    };
    User.findOneAndUpdate({_id: ObjectId(userId)}, {$set: userData}, {upsert: true}, (err, user) => {
      if (err) {
        reject();
      } else {
        resolve(user);
      }
    });
  });
};

var updateExistingOrCreateNewUser = function (facebookProfile) {
  return new Promise((resolve, reject) => {
    var userData = {
      facebookUserId: facebookProfile.id,
      name: facebookProfile.name || '',
      image: facebookProfile.picture.data.url
    };
    User.findOneAndUpdate({facebookUserId: facebookProfile.id}, {$set: userData}, {upsert: true}, (err, user) => {
      if (err) {
        reject();
      } else if (!user) {
        var newUser = new User(userData);
        newUser.save(function (err, user) {
          if (err) {
            reject();
          } else {
            resolve(user);
          }
        });
      } else {
        resolve(user);
      }
    });
  });
};

var apiRoutes = express.Router();

// profiladmin
apiRoutes.get('/profile/:id',validateToken, function(req, res) {
    console.log(fs);

    User.findOne({_id: ObjectId(req.params.id)}, function(err, user) {
        if (user && !hasInCompleteProfile(user)) {
            if (user.achievments &&
                user.achievments.insider &&
                user.achievments.insider.name &&
                !_.contains(user.achievments.insider.name, "Komplett utfylt profil")) {
                user.achievments.insider.name.push("Komplett utfylt profil");
            }
        }
        res.json(user);
    });

});



// Bilde
apiRoutes.get('/garments/:id',validateToken, function (request, response){
        Garments.findOne({_id: request.params.id}, function(err, garment) {
            if (err){
                return response.status(500).send("Noe gikk galt!")
            }

            response.send(garment);

        });

});

apiRoutes.get('/photos/:id', validateToken, function (request, response){
    var result = {};
    User.findOne({_id: request.params.id}, function(err, users) {
        if (err){
            return response.status(500).send("Noe gikk galt!")
        }
        result = users;
        for ( var photo in users.photos){
            result.photos[photo].name = nconf.get('CLOUDFRONT_DOMAIN') + '/images/' + users.photos[photo].name
        }
        console.log(result)
        response.send(users.photos);

    });

});

// Tryons

apiRoutes.get('/tryons/:id', validateToken, function (request, response){
    var result = {};
    User.findOne({_id: request.params.id}, function(err, users) {
        if (err){
            return response.status(500).send("Noe gikk galt!")
        }

        response.send(users.tryon_sessions);

    });

});

// Kvittering

apiRoutes.get('/receipts/:id', validateToken, function (req, res) {
    Receipt.find({userID: ObjectId(req.params.id)}, function(err, receipts) {
        if (err){
            console.log(err)
            return;
        }
        res.json(receipts);
    });
});


// Login
apiRoutes.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            console.log("No user found");
            res.sendStatus(401); //Unauthorized
        } else {
          // Check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              res.json({token: createToken(user), _id:user._id});
            } else {
              res.status(403).send({error: 'Authentication failed. Invalid password.'});
            }
          });
        }
    });
});

apiRoutes.post('/authenticate/facebook', function(req, res) {
  var accessToken = req.body.accessToken;
  if (!accessToken) {
    res.status(403).send('Missing accessToken.');
  } else {
    console.log(accessToken);
    validateFacebookToken(accessToken)
      .then((facebookProfile) => {
        updateExistingOrCreateNewUser(facebookProfile)
          .then((user) => {
            res.json({token: createToken(user), _id: user._id});
          })
          .catch(() => {
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        res.status(403).send('Invalid accessToken.');
      });
  }
});

apiRoutes.post('/mergeaccounts', function (req, res) {
  var accessToken = req.body.accessToken;
  var userId = req.body.userId;
  if (!accessToken || !userId) {
    res.status(403).send('Missing accessToken.');
  } else {
    validateFacebookToken(accessToken)
      .then((facebookProfile) => {
        console.log('merging accounts fbUser: ');
        console.log(facebookProfile.id);
        console.log('with existing userId..');
        console.log(userId);
        mergeFBUserWithExistingUser(facebookProfile, userId)
          .then((user) => {
            res.json({_id: user._id});
          })
          .catch(() => {
            console.log('could not update user');
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        res.status(403).send('Invalid accessToken.');
      });
  }
});


// Register new users
apiRoutes.post('/register', function(req, res) {
    if(!req.body.username || !req.body.password) {
        return res.status(500).send({error: 'Please enter username and password.', errorCode: ''});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            name: '',
            achievments:{insider:{
                name: []
            }}

        });

        // Attempt to save the user
        newUser.save(function(err, user) {
            if (err) {
                return res.status(500).send({error: 'The username already exists.'});
            }
            res.json({token: createToken(newUser), _id: user._id});
        });
    }
});

//endre profil
apiRoutes.put('/users/:id', validateToken, function(req, res) {
    if (!req.body) {
      res.sendStatus(500);
    }
    User.update({_id:req.params.id}, req.body, {upsert: true}, function (err) {
        if (err){
            console.log(err)
            res.sendStatus(500);
        }
        res.json(req.body);
    });

});

//slette profil

apiRoutes.delete('/profile/:id', validateToken, function(req, res) {

    User.findByIdAndRemove( req.params.id, function (err) {

        res.json(req.body);
    });

});

var hasInCompleteProfile = function (user) {
  return !user.username ||
    !user.name ||
    !user.password ||
    !user.email ||
    !user.dateOfBirth;
}

apiRoutes.get('/vote/', function (req,res) {
    Vote.find({}, function (err,vote) {
        if (err){
            return res.sendStatus(500);

        }

        res.json(vote)
    })

});


apiRoutes.post('/vote', function (req,res) {
    console.log("her1")
    Vote.update({_id:req.body._id},req.body, function (err,vote) {
        if (err){
            return res.sendStatus(500);

        }

        res.json(vote)
    })

});
apiRoutes.put('/vote', function (req,res) {
    console.log("22222")
    Vote.update({_id:req.body._id},req.body, function (err,vote) {
        if (err){
            return res.sendStatus(500);

        }

        res.json(vote)
    })

});
app.use('/api', apiRoutes);

var data = fs.readFileSync('./src/database/ml-100k/u.data').toString().split(/[\s,\n]+/);
var ratings = {};






// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
