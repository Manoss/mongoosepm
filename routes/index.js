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
  .get()
  .post();

router
  .route('/user/delete')
  .get()
  .post();

router
  .route('/login')
  .get(ctrlUser.login)
  .post(ctrlUser.doLogin);

router
  .route('/logout')
  .get();

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
  .get();

router
  .route('/project/edit/:id')
  .get()
  .post();

router
  .route('/project/delete/:id')
  .get()
  .post();

module.exports = router;
