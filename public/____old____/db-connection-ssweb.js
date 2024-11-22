
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "southshoreweb.com",
  user: "southsho_tina",
  password: "TinaRagusaRx",
  database: "southsho_medications"
});

con.connect(function(err) {
  if (err) throw err;
  //Select all customers and return the result object:
  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
})