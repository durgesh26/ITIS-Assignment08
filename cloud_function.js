/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 exports.helloWorld = (req, res) => {
    let x = req.query.keyword;
      if(x){
          res.send("durgesh says "+x);
      }else{
          res.send("wrong request");
      }
  };
  