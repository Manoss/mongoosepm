// Bring Mongoose into the project
var mongoose = require( 'mongoose' );
// Build the connection string
var dbURI = 'mongodb://localhost/MongoosePM';
// Create the database connection
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected through app termination');
   process.exit(0);
 });
});

/* ********************************************
    USER SCHEMA
******************************************** */
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    email: {
        type: String, 
        unique:true,
        required: true,
        validate: {
            validator: emailValidator,
            message: 'Not a valid Email'
        }
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

function emailValidator (email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    return regexEmail.test(email);
}

// Build the User model
mongoose.model( 'User', userSchema );

/* ********************************************
    PROJECT SCHEMA
******************************************** */
var projectSchema = new mongoose.Schema({
    projectName: String,
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: String,
    contributors: String,
    tasks: String
});

projectSchema.statics.findByUserID = function (userid, callback) {
    this.find(
      { createdBy: userid },
      '_id projectName',
      {sort: 'modifiedOn'},
      callback);
};

// Build the Project model
mongoose.model( 'Project', projectSchema );