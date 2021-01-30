// Bring Mongoose into the project
var mongoose = require( 'mongoose' );
// Build the connection string
var dbURI = 'mongodb://localhost/MongoosePM';
// Create the database connection
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});

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
    TASK SCHEMA
******************************************** */
var taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        minlength: 5
    },
    taskDesc: String,
    createdOn: { 
        type: Date, 
        default: Date.now 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    modifiedOn: Date,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


/* ********************************************
    PROJECT SCHEMA
******************************************** */
var projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    contributors: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    tasks: [taskSchema]
});

projectSchema.statics.findByUserID = function (userid, callback) {
    this.find(
      { createdBy: userid },
      '_id projectName',
      {sort: 'modifiedOn'},
      callback);
};

/**
 * Find if a projectName exist
 */

projectSchema.path('projectName').validate({
    validator: function (value) {
        return new Promise(function (resolve, reject) {
            Project.findOne({projectName: value}, function(err, project){
                if (err){
                    console.log(err);
                    reject(new Error(err));
                }
                console.log('Projects found: ' + project);
                if (project !== null) {
                    resolve(false)
                }else{
                    resolve(true);
                }            
            })  

        });
    },
    message: 'Duplicate project `{VALUE}`'
});

// Build the Project model
const Project = mongoose.model( 'Project', projectSchema );