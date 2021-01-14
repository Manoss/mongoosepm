var mongoose = require('mongoose');
var User = mongoose.model('User');

const create = function(req, res){
    res.render('user-form', {
        title: 'Create user',
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
                    res.redirect('/?error=true');
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
                        res.redirect('/user');
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


module.exports = {
    create,
    doCreate,
    index,
    indexPage,
    login,
    doLogin
}