var mongoose = require('mongoose');
var Project = mongoose.model('Project');


const create = function(req, res){
    res.render('project-form', {
        title: 'Create project',
        projectName: '',
        contributors: '',
        tasks: '',
        buttonText: "Validate"
    });
}

// POST new project creation form
const doCreate = function(req, res){
    if (req.session.loggedin !== true){
        res.redirect('/login');
    }else{
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
                    res.redirect('/project?404=project');
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

/*****************************************
 * Update Project
 ****************************************/

// GET project edit form
const edit = function(req, res){
    if (req.session.loggedin !== true){
        res.redirect('/login');
    }else{
        Project.findById(req.params.id, function(err, project){
            if(err){
                console.log(err);
                res.redirect('/project?404=project');
            }else{
                res.render('project-form', {
                    title: 'Edit profile',
                    _id: req.params.id,
                    projectName: project.projectName,
                    contributors: project.contributors,
                    tasks: project.tasks,
                    createdBy: project.createdBy,
                    buttonText: "Update"
                });
            }     
        })
        
    }
};

const doEdit = function(req, res) {
    if (req.params.id) {
        Project.findById(req.params.id,
            function (err, project) {
                if(err){
                    console.log(err);
                    res.redirect( '/project?error=finding');
                } else {
                    project.projectName = req.body.ProjectName;
                    project.contributors = req.body.Contributor;
                    project.tasks = req.body.Task;
                    project.modifiedOn = Date.now();
                    project.save(function (err) {
                        if(!err){
                            console.log('Project updated: ' + req.body.ProjectName);
                            res.redirect( '/project/' + req.params.id );
                        } 
                    });
                } 
            }
        ); 
    };
};

/*****************************************
 * Delete Project
 ****************************************/

// GET user delete confirmation form
const confirmDelete = function(req, res){
    console.log("Project ID : " + req.params.id);
    Project.findById(req.params.id, (err, project)=> {
        if (!err) {
            console.log("Project : " + project);
            res.render('project-delete-form', {
                title: 'Delete project',
                _id: req.params.id,
                projectName: project.projectName,
                tasks: project.tasks,
                contributors: project.contributors
            }); 
        }else{
            console.log("Error Delete Project : " + err);
            res.json(err);
        }
    });
    
};

// POST project delete form
const doDelete = function(req, res) {
    if (req.body._id) {
        Project.findByIdAndRemove(
            req.body._id,
            function (err, project) {
                if(err){
                    console.log(err);
                    return res.redirect('/project?error=deleting');
                }
                console.log("Project deleted:", project);
                res.redirect('/user');
            }
        );
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
    index,
    edit,
    doEdit,
    confirmDelete,
    doDelete
}