var mysql = require('mysql');
var connection = mysql.createConnection(
{
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: "competetions",
  port: 3306
});
connection.connect(function (err)
{
  if (err)
  {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection