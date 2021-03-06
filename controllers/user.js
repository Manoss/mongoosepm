var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');

const create = function(req, res){
    res.render('user-form', {
        title: 'Create user',
        name: "",
        email: "",
        buttonText: "Join!"
    });
}

// POST new user creation form
const doCreate = function(req, res){
    User.create({
        name: req.body.FullName,
        email: req.body.Email,
        modifiedOn : Date.now(),
        lastLogin : Date.now()
        }, function( err, user ){
            if(err) {
                console.log(err);
                if(err.code===11000) {
                    res.redirect('/user/new?exists=true');
                } else {
                    res.render('user-form', {
                        title: 'Create user',
                        error: err.message,
                        name: req.body.FullName,
                        email: req.body.Email,
                        buttonText:'Join!'
                    });
                }
            } else {
                // Success
                console.log("User created and saved: " + user);
                req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
                req.session.loggedin = true;
                res.redirect('/user');
            }
        }
    ); 
};

// GET logged in user page
const index = function (req, res) {
    if(req.session.loggedin === true){
        res.render('user-page', {
        title: req.session.user.name,
        name: req.session.user.name,
        email: req.session.user.email,
        userID: req.session.user._id
        }) 
    }else{
        res.redirect('/login');
    }
}

const indexPage = function (req, res) {
    res.render('index', {
        title: "Mongoose for Application Development"
    })
}

/*****************************************
 * Login User
 ****************************************/

// GET login page
const login = function (req, res) {
    res.render('login-form', {title: 'Log in'})
}

const doLogin = function (req, res) {
    if (req.body.Email) {
        User.findOne(
            { 'email' : req.body.Email },
            '_id name email',
            function(err, user) {
                if(!err) {
                    if(!user) {
                        res.redirect('/login?404=user');
                    } else {
                        req.session.user = {
                            "name" : user.name,
                            "email" : user.email,
                            "_id" : user._id
                        };
                        req.session.loggedin = true;
                        console.log('Logged in user: ' + user);
                        User.updateOne(
                            {_id:user._id},
                            { $set: {lastLogin: Date.now()} },
                            function(){
                                res.redirect( '/user' );
                            }
                        );
                    }
                } else {
                    res.redirect('/login?404=error');
                }
            }
        )
    } else {
        res.redirect('/login?404=error');
    }
}

/*****************************************
 * Update User
 ****************************************/

// GET user edit form
const edit = function(req, res){
    if (req.session.loggedin !== true){
        res.redirect('/login');
    }else{
        res.render('user-form', {
            title: 'Edit profile',
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email,
            buttonText: "Update"
        }); 
    }
};

const doEdit = function(req, res) {
    if (req.session.user._id) {
        User.findById( req.session.user._id,
            function (err, user) {
                if(err){
                    console.log(err);
                    res.redirect( '/user?error=finding');
                } else {
                    user.name = req.body.FullName;
                    user.email = req.body.Email;
                    user.modifiedOn = Date.now();
                    user.save(function (err) {
                        if(!err){
                            console.log('User updated: ' + req.body.FullName);
                            req.session.user.name = req.body.FullName;
                            req.session.user.email = req.body.Email;
                            res.redirect( '/user' );
                        }else{
                            console.log(err);
                            res.render('user-form', {
                                title: 'Edit profile',
                                error: err.message,
                                name: req.body.FullName,
                                email: req.body.Email,
                                buttonText: "Update"
                            });
                        } 
                    });
                } 
            }
        ); 
    };
};

/*****************************************
 * Delete User
 ****************************************/

// GET user delete confirmation form
const confirmDelete = function(req, res){
    res.render('user-delete-form', {
        title: 'Delete account',
        _id: req.session.user._id,
        name: req.session.user.name,
        email: req.session.user.email
    }); 
};

// POST user delete form
const doDelete = function(req, res) {
    if (req.body._id) {
        User.findByIdAndRemove(
            req.body._id,
            function (err, user) {
                if(err){
                    console.log(err);
                    return res.redirect('/user?error=deleting');
                }
                /** Delete Projects */
                Project.findByUserID(
                    req.body._id,
                    function (err, projects) {
                        if(!err){
                            console.log(projects);
                            Project.deleteMany({createdBy: req.body._id}, (err, result)=> {
                                if(err) {
                                    console.log("Error Deleted Projects : " + err)
                                }
                                console.log("Count deleted documents : " + result.deletedCount);
                            });
                            
                        }else{
                            console.log(err);
                            res.json({"status":"error", "error":"Error finding projects"});
                        } 
                    }
                )
                console.log("User deleted:", user);
                clearSession(req.session, function () {
                    res.redirect('/');
                });
            }
        );
    } 
};

const logout = function (req, res) {
    console.log("Logout");
    clearSession(req.session, ()=> {
        res.redirect('/');
    }) 
}

var clearSession = function(session, callback){
    session.destroy();
    callback();
};

module.exports = {
    create,
    doCreate,
    index,
    indexPage,
    login,
    doLogin,
    edit,
    doEdit,
    confirmDelete,
    doDelete,
    logout
}