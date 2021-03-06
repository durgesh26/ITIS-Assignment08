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
 *       description: Return all customer details from the customer table
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: customer table display
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

/**
 * @swagger
 * /orders:
 *     get:
 *       description: Return all orders  from the order table
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: orders table display
 */

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

/**
 * @swagger
 * /foods:
 *     get:
 *          description: return all foods items from the food table
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: food table display
 */

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

app.get("/api/:tab_name", (req, res) => {
    pool
        .getConnection()
        .then((conn) => {
            let query = "select * from " + req.params.tab_name;
            conn
                .query(query)
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    conn.release();
                    res.status(500).json(err);
                });
        })
        .catch((err) => {
            // res.status(500).json(err);
            error_res = { error: { msg: "failed to connect database" } };
            res.status(500).json(error_res);
        });
});



app.post('/company', (req,res) => {
	pool.getConnection().then(conn => {
	    conn.query("INSERT INTO company values('" + req.body.COMPANY_ID.trim() + "','" + req.body.COMPANY_NAME.trim() + "','" + req.body.COMPANY_CITY.trim() + "')").then(rows => {
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
