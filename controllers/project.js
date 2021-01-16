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

 // GET project info
const displayInfo = function(req, res) {
    console.log("Finding project _id: " + req.params.id);
    if (req.session.loggedin !== true){
        res.redirect('/login');
    }else{
        if (req.params.id) {
            Project.findById( req.params.id, function(err,project) {
                if(err){
                    console.log(err);
                    res.redirect('/user?404=project');
                }else{
                    console.log(project);
                    res.render('project-page', {
                        title: project.projectName,
                        projectName: project.projectName,
                        tasks: project.tasks,
                        createdBy: project.createdBy,
                        projectID: req.params.id
                    }); 
                }
            }); 
        }else{
            res.redirect('/user');
        }
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
    displayInfo,
    index
}