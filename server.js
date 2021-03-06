const express = require('express');
const app = express();
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
	swaggerDefinition: {
		info: {
			title : 'Test REST-like API',
			version: '1.0.0',
			description: 'Test REST-like API with swagger',
		},
		host: '167.99.230.251:3000',
		basePath:'/',
	},
	apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());


 
/**
 * @swagger
 * /
 *     get:
 *       description: Return all foods items from the table
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Object of  food containing array of prices
 */

/**
 * @swagger
 * /company:
 *     post:
 *          description: insert data of company
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Object od comapany containing array of company details
 */


const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'sample',
	port: 3306,
	connectionLimit: 5
});



/**
 * @swagger
 * /customer:
 *     get:
 *       description: Return all customer
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Object food containing array of prices
 */

app.get('/customer', (req,res) => {
	pool.getConnection().then(conn => {
		conn.query('select * from customer').then(rows => {
			conn.release();
			res.json(rows);	
		})
		.catch(err => {
			conn.release();
			res.json(err);
		})

	})
	.catch(err =>{
		res.json(err);
	})
});

app.get('/orders', (req,res) => {
	pool.getConnection().then(conn => {
		conn.query('select * from orders where agent_code=?',req.query.agent_code).then(rows =>{
			conn.release();
			res.json(rows);
		})
		.catch(err => {
			conn.release();
			res.json(err);
		})
	})
	.catch(err =>{
		conn.release();
		res.json(err);	
	})
});

app.get('/foods', (req,res) => {
	pool.getConnection().then(conn => {
		conn.query('select * from foods').then(rows => {
			conn.release();
			res.json(rows);
		})
		.catch(err => {
			conn.release();
			res.json(err);
		})
	})
	.catch(err => {
		res.json(err);
	})
});

app.post('/company', (req,res) => {
	pool.getConnection().then(conn => {
		conn.query("INSERT INTO company(COMPANY_ID,COMPANY_NAME,COMAPANY_CITY)values('20','Tesla','New York\r')").then(rows => {
			conn.release();
			res.json(rows);
		})
		.catch(err => {
			conn.release();
			res.json(err);
		})

	})
	.catch(err => {
		res.json(err);
	})
});

app.listen(port, () => {
	console.log('Example app listening at http://localhost:${port}');
})
