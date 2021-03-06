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
app.use(express.urlencoded({extended:true}));
app.use(express.json());

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
 * /orders/{agentcode}:
 *     get:
 *       description: Return all orders  from the order table
 *       produces:
 *          - application/json
 *       parameters:
 *        - name: agentcode
 *          in: path
 *          desciption: agent_code
 *          required: true
 *          type: string
 *       responses:
 *          200:
 *              description: orders table display
 */

app.get('/orders/:agentcode', (req,res) => {
	pool.getConnection().then(conn => {
		conn.query('select * from orders where agent_code=?',req.params.agentcode).then(rows =>{
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

/**
 * @swagger
 * /company:
 *     post:
 *          description: insert company data into company table
 *          produces:
 *              - application/json
 *          parameters:
 *              - in: body
 *                name: company
 *                description: the company to create
 *                schema:
 *                   type: object
 *                   required: 
 *                       - COMPANY_ID
 *                   properties:
 *                       COMPANY_ID:
 *                          type: string
 *                       COMPANY_NAME:
 *                          type: string
 *                       COMPANY_CITY:
 *                          type: string
 *          responses:
 *              200:
 *                  description: food table display
 */

app.post('/company', (req,res) => {
	let query = "INSERT INTO company values('" + req.body.COMPANY_ID.trim() + "','" + req.body.COMPANY_NAME.trim() + "','" + req.body.COMPANY_CITY.trim() + "')"
	console.log(query);
	pool.getConnection().then(conn => {
	    conn.query(query).then(rows => {
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


app.patch("/company", (req, res) => {
    pool.getConnection().then((conn) => {
            let query = "select * from company where COMPANY_ID=" + req.body.COMPANY_ID;
            conn
                .query(query)
                .then((rows) => {
                    let query_update = "update company set ";
                    if (req.body.COMPANY_NAME) {
                        query_update += "COMPANY_NAME='" + req.body.COMPANY_NAME.trim() + "', ";
                    }
                    if (req.body.COMPANY_CITY) {
                        query_update += "COMPANY_CITY='" + req.body.COMPANY_CITY.trim() + "' ";
                    }
                    query_update += "where COMPANY_ID='" + req.body.COMPANY_ID.trim()+"'";
                    conn.query(query_update)
                        .then((rows) => {
                            conn.release();
                            res.json(output);
                        })
                        .catch((err) => {
                            conn.release();
                            res.json(err);
                        });
                })
                .catch((err) => {
                    conn.release();
                    res.json(err);
                });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});


/**
 * @swagger
 * /company/{id}:
 *     delete:
 *       description: delete all data of the id passed in the company table
 *       produces:
 *          - application/json
 *       parameters:
 *        - name: id
 *          in: path
 *          desciption: company id
 *          required: true
 *          type: string
 *       responses:
 *          200:
 *              description: company  table display
 */

app.delete("/company/:id", (req, res) => {
    pool.getConnection().then((conn) => {
            let query = "DELETE FROM company WHERE COMPANY_ID=" + req.params.id;
            conn
                .query(query)
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    conn.release();
                    res.json(err);
                });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});




app.put("/company/:COMPANY_ID", (req, res) => {
    pool.getConnection().then((conn) => {
            let query = "select * from company where COMPANY_ID=" + req.params.COMPANY_ID;
            conn
                .query(query)
                .then((rows) => {
                    let new_query = ""
                    if(rows.length > 0){
                        new_query += "update company set ";
                    if (req.body.COMPANY_NAME) {
                        new_query += "COMPANY_NAME='" + req.body.COMPANY_NAME.trim() + "', ";
                    }
                    if (req.body.COMPANY_CITY) {
                        new_query += "COMPANY_CITY='" + req.body.COMPANY_CITY.trim() + "' ";
                    }
                    new_query += "where COMPANY_ID='" + req.params.COMPANY_ID.trim()+"'";
                    }else{
                        new_query += "insert into company values('" + req.params.COMPANY_ID.trim() + "','" + req.body.COMPANY_NAME.trim() + "','" + req.body.COMPANY_CITY.trim() + "')";
                    }
                    
                    conn.query(new_query)
                        .then((rows) => {
                            conn.release();
                            res.json(output);
                        })
                        .catch((err) => {
                            conn.release();
                            res.json(err);
                        });
                })
                .catch((err) => {
                    conn.release();
                    res.json(err);
                });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

app.listen(port, () => {
	console.log('Example app listening at http://localhost:${port}');
})
