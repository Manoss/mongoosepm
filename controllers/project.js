var mongoose = require('mongoose');
var Project = mongoose.model('Project');


const create = function(req, res){
    res.render('project-form', {
        title: 'Create project',
        buttonText: "Validate"
    });
}

// POST new project creation form
const doCreate = function(req, res){
    Project.create({
        projectName: req.body.ProjectName,
        contributors: req.body.Contributor,
        tasks: req.body.Task,
        createdBy: req.session.user._id,
        modifiedOn : Date.now()
        }, function( err, project ){
            if(err) {
                console.log(err);
                if(err.code===11000) {
                    res.redirect('/project/new?exists=true');
                } else {
                    res.redirect('/?error=true');
                }
            } else {
                // Success
                console.log("Project created and saved: " + project);
                res.redirect('/user');
            }
        }
    ); 
};

// GET Projects by UserID
exports.byUser = function (req, res) {
    console.log("Getting user projects");
    if (req.params.userid){
        Project.findByUserID(
            req.params.userid,
            function (err, projects) {
                if(!err){
                    console.log(projects);
                    res.json(projects);
                }else{
                    console.log(err);
                    res.json({"status":"error", "error":"Error finding projects"});
                } 
            }
        )
    }else{
        console.log("No user id supplied");
        res.json({"status":"error", "error":"No user id supplied"});
    } 
};

// GET Projects by UserID
const byUser = function (req, res) {
    console.log("Getting user projects");
    if (req.params.userid){
        Project.findByUserID(
            req.params.userid,
            function (err, projects) {
                if(!err){
                    console.log(projects);
                    res.json(projects);
                }else{
                    console.log(err);
                    res.json({"status":"error", "error":"Error finding projects"});
                } 
            }
        )
    }else{
        console.log("No user id supplied");
        res.json({"status":"error", "error":"No user id supplied"});
    }        
};

// GET Project page
const index = function (req, res) {
    res.render('project-page')
}

module.exports = {
    create,
    doCreate,
    byUser,
    index
}