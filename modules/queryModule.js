var gently = new (require('gently'));
//Function to connect to database and execute query
function queryModule(){
    this.executeQuery = function(res, query, db){

        db.connect(function(err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                } 
        //console.log('connection OK');
        });

        db.query(query,  gently.expect(function selectCb(err, results, fields) {
            if (err) {
              throw err;
            }
            /*Object.keys(results).forEach(function(key) {
                var row = results[key];
                console.log(row.Time);
            });*/ 
            //console.log(results, "hola");           
            res.json(results);           
            db.end();
          

          })
        );
    }
}

module.exports = queryModule;