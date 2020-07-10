require('../models/User');
require('../models/Blog');
const dotenv = require('dotenv');
const result = dotenv.config();
const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
jest.setTimeout(18000);