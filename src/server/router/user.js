const express = require('express');
const jwt = require('jsonwebtoken');
const api = require('../api/user');
const hash = require('../hash');
const Code = require('./code');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.post('/api/register', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { username, email, password } = req.body;
  if (username === undefined || email === undefined || password === undefined) {
    res.json({ code: Code.FAILED, message: 'Invalid registration inputs.' });
    return;
  }

  api.registerUser(username, email, password)
    .then(() => api.getUser(username))
    .then((rows) => {
      const userData = {
        user: rows[0].username,
        id: rows[0].id,
        email: rows[0].email,
        type: rows[0].type
      };

      const token = jwt.sign({ userData }, process.env.SECRET_KEY);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: process.env.EXPIRESIN
      });
      res.json({
        code: Code.SUCCEEDED,
        message: 'successful registration',
        data: userData
      });
    }).catch((err) => {
      let message = '';
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          message = 'User already exists';
          break;
        default:
          console.log(err);
          message = 'Registration Failed';
          break;
      }
      res.json({ code: Code.FAILED, message });
    });
});

router.post('/api/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { username, password } = req.body;

  api.getUser(username).then((users) => {
    if (users.length !== 1) {
      throw new Error('Invalid login credentials.');
    }

    const user = users[0];
    const checkPass = hash.passwordHash(password + process.env.STATIC_SALT + user.salt);
    if (user.pass !== checkPass) {
      throw new Error('Invalid login credentials.');
    }

    const userData = {
      user: user.username,
      id: user.id,
      email: user.email,
      type: user.type
    };
    const token = jwt.sign({ userData }, process.env.SECRET_KEY);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: process.env.EXPIRESIN
    });
    res.json({
      code: Code.SUCCEEDED,
      message: 'successful login',
      data: userData
    });
  }).catch((err) => {
    res.json({ code: Code.FAILED, message: err.message });
  });
});



router.get('/api/me', verifyToken, (req, res) => {
  const { userData } = req.payload;
  res.json({
    code: Code.SUCCEEDED,
    message: 'successful login',
    data: userData
  });
});

router.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    code: Code.SUCCEEDED,
    message: 'successful logout'
  });
});

router.get('/api/getProfile/:ID', verifyToken, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { ID } = req.params;
  api.getProfile(ID).then((rows) => {
    res.json(rows[0]);
  }).catch((err) => {
    res.json({ code: Code.FAILED, message: err.message });
  });
});

router.put('/api/updateProfile/:ID', (req, res) => {
  const profile = {
    email: req.body.email,
    username: req.body.username,
    about: req.body.about,
    name: req.body.name,
    loc: req.body.loc,
    DOB: req.body.DOB,
    id: req.body.id
  };
  console.log('profile', profile);
  api.updateProfile(profile).then((rows) => {
    res.json(rows);
    console.log(rows);
  }).catch((err) => {
    res.json({ code: Code.FAILED, message: 'Failed to update user profile' });
    console.log(err);
  });
});

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
// eslint-disable-next-line no-unused-vars
router.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});

module.exports = router;
