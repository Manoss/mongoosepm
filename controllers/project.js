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
        createdBy: req.body.CreatedBy,
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

// GET Project page
const index = function (req, res) {
    res.render('project-page')
}

module.exports = {
    create,
    doCreate,
    index
}