var mongoose = require('mongoose');
var Project = mongoose.model('Project');

/*****************************************
 * Add Task
 ****************************************/

const create = function(req, res){
    res.render('task-form', {
        title: 'Create task',
        taskName: '',
        taskDesc: '',
        buttonText: "Validate"
    });
}

// POST new project creation form
const doCreate = function(req, res){
    if (req.session.loggedin !== true){
        res.redirect('/login');
    }else{
        Project.findById(req.params.projectid, 'tasks modifiedOn',
            function( err, project ){
                if(!err) {
                    project.tasks.push({
                        taskName: req.body.TaskName,
                        taskDesc: req.body.TaskDesc,
                        createdBy: req.session.user._id
                    });
                project.modifiedOn = Date.now();
                project.save(function(err, project) {
                    if(err) {
                        console.log('Oh dear', err);
                        res.render('task-form', {
                            error: err,
                            taskName: req.body.TaskName,
                            taskDesc: req.body.TaskDesc,
                            buttonText: "Validate"
                        })
                    } else {
                        console.log('Task saved: ' + req.body.TaskName);
                        res.redirect('/project/' + req.params.projectid);
                    }
                });
                }
            }
        )
    }
};

module.exports = {
    create,
    doCreate
}