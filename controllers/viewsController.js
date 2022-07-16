const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const connectSrc =
  'https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com ws://127.0.0.1:58095/ http://127.0.0.1:3000/api/v1/users/logout https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js http://127.0.0.1:3000/api/v1/users/login';

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build templete
  // 3) Render that template using tour data from 1)
  res
    .status(200)
    .set('Content-Security-Policy', `connect-src ${connectSrc}`)
    .render('overview', {
      title: 'All Tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  res
    .status(200)
    .set('Content-Security-Policy', `connect-src ${connectSrc}`)
    .render('tour', {
      title: `${tour.name}`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'User Login',
    });
};

exports.getAccount = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('account', {
      title: 'Your account',
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('account', {
      title: 'Your account',
      user: updatedUser,
    });
});
