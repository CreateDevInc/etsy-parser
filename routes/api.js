var express = require('express');
var router = express.Router();
const { saleController, companyController, urlController, queryController } = require('../api/routes');

router
  .route('/sales')
  .get(saleController.get)
  .post(saleController.post)
  .put(saleController.put)
  .delete(saleController.delete);

router
  .route('/sales/:id')
  .get(saleController.getId)
  .post(saleController.postId)
  .put(saleController.putId)
  .delete(saleController.deleteId);

router
  .route('/companies')
  .get(companyController.get)
  .post(companyController.post)
  .put(companyController.put)
  .delete(companyController.delete);

router
  .route('/companies/:id')
  .get(companyController.getId)
  .post(companyController.postId)
  .put(companyController.putId)
  .delete(companyController.deleteId);

router
  .route('/urls')
  .get(urlController.get)
  .post(urlController.post)
  .put(urlController.put)
  .delete(urlController.delete);

router
  .route('/urls/:id')
  .get(urlController.getId)
  .post(urlController.postId)
  .put(urlController.putId)
  .delete(urlController.deleteId);

router.route('/salesQuery').get(queryController.getSales);

module.exports = router;
