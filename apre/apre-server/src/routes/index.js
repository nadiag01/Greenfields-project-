/**
 * Author: Professor Krasso
 * Date: 7 August 2024
 * File: index.js
 * Description: Routing for the index page.
 */

'use strict';

// require statements
const express = require('express');
const router = express.Router();

/**
 * @description
 * Route handler for the root path ('/').
 *
 * This route responds with a JSON message when accessed.
 *
 * Usage:
 *
 * router.get('/', function(req, res, next) {
 *   res.send({
 *     message: 'Hello from the ETS server!'
 *   });
 * });
 *
 * Example:
 *
 * // Accessing the root path
 * // GET http://<server-address>/
 *
 * // Response:
 * // {
 * //   "message": "Hello from the ETS server!"
 * // }
 */
router.get('/', function(req, res, next) {
  const appName = 'Expense Tracking System';
  res.send({
    message: `Hello from the ${appName} server!`
  });
});



/**
 * @description
 *
 * GET /salesData
 *
 * Fetches all sales data .
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/salesData/:salesData', (req, res, next) => {
  try {
    mongo (async db => {
      const saleData = await db.collection('sales').aggregate([
        { $match: { sales: req.params.sales} },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReport);
    }, next);
  } catch (err) {
    console.error('', err);
    next(err);
  }
});

module.exports = router;



module.exports = router;


