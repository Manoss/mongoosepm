var express = require('express');
var router = express.Router();
const ctrlUser = require('../controllers/user');
const ctrlProject = require('../controllers/project')

router
  .route('/')
  .get(ctrlUser.indexPage)


/* USER Routes */
router
  .route('/user')
  .get(ctrlUser.index);

router
  .route('/user/new')
  .get(ctrlUser.create)
  .post(ctrlUser.doCreate);

router
  .route('/user/edit')
  .get(ctrlUser.edit)
  .post(ctrlUser.doEdit);

router
  .route('/user/delete')
  .get(ctrlUser.confirmDelete)
  .post(ctrlUser.doDelete);

router
  .route('/login')
  .get(ctrlUser.login)
  .post(ctrlUser.doLogin);

router
  .route('/logout')
  .get(ctrlUser.logout);

/* PROJECT Routes */

router
  .route('/project')
  .get(ctrlProject.index);

router
  .route('/project/new')
  .get(ctrlProject.create)
  .post(ctrlProject.doCreate);

router
  .route('/project/:id')
  .get(ctrlProject.displayInfo);

router
  .route('/project/edit/:id')
  .get(ctrlProject.edit)
  .post(ctrlProject.doEdit);

router
  .route('/project/delete/:id')
  .get(ctrlProject.confirmDelete)
  .post(ctrlProject.doDelete);

router
  .route('/project/byuser/:userid')
  .get(ctrlProject.byUser)

router
  .route('/task/new/:projectid')
  .get(ctrlProject.createTask)
  .post(ctrlProject.doCreateTask);

router
  .route('/project/:id/task/edit/:taskID')
  .get(ctrlProject.editTask)
  .post(ctrlProject.doEditTask)

router
  .route('/project/:id/task/delete/:taskID')
  .get(ctrlProject.confirmDeleteTask)
  .post(ctrlProject.doDeleteTask)

module.exports = router;
