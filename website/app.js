/* Third Party */
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
/* Internal */
var mysql = require('./helpers/mysql_util');
app.use(bodyParser.urlencoded({
  extended: true,
  parameterLimit: 10000,
  limit: '50mb'
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Custom-Header");
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
  next();
});
app.use('/', express.static(__dirname + '/view'));
app.get('/hall', function (req, res) {
  var sql_neg = "select data_screen_name as dsn, count(*) as negative_total, ( select tweet_text from tweets where data_screen_name = dsn order by created_at desc limit 1) from tweets  where machine_label='neg' group by data_screen_name Order by count(*) desc limit 15;"
  mysql.query(sql_neg, function (err, rows1, fields) {
    if (err) throw err;
    var data_screen_name = []
    for (var i = 0; i < rows1.length; i++) {
      data_screen_name.push("'"+rows1[i].data_screen_name+"'")
    }
    var sql_all = "select data_screen_name, count(*) as all_total from tweets  where data_screen_name in (" + data_screen_name + ") group by data_screen_name ;";
    mysql.query(sql_all, function (err, rows2, fields) {
      if (err) throw err;
      var sql_pos = "select data_screen_name, count(*) as positive_total from tweets  where machine_label='pos' AND data_screen_name in (" + data_screen_name + ") group by data_screen_name;";
      
      mysql.query(sql_pos, function (err, rows3, fields) {
        if (err) throw err;

        var response_obj = [];
        for (var i = 0; i < rows1.length; i++) {
          var push_obj = {};

          push_obj.data_screen_name = rows1[i].data_screen_name;
          push_obj.profile_pic = rows1[i].profile_pic;
          push_obj.last_tweet = rows1[i].tweet_text;
          push_obj.neg =  rows1[i].negative_total;
          if(rows2 && rows2.length > 0){
            var all_data_arr = _.filter(rows2, {'data_screen_name': rows1[i].data_screen_name });
            if(all_data_arr && all_data_arr.length >0){
              push_obj.all_total = all_data_arr[0].all_total ;
            }else{
              push_obj.all_total = 0 ;
            }
          }
          if(rows3 && rows3.length > 0){
            var pos_data_arr = _.filter(rows3, {'data_screen_name': rows1[i].data_screen_name });
            if(pos_data_arr && pos_data_arr.length >0 && pos_data_arr[0] && pos_data_arr[0].positive_total){
              push_obj.pos = pos_data_arr[0].positive_total ;
            }else{
              push_obj.pos = 0 ;
            }
          }          
         response_obj.push(push_obj);
        }
        res.send(response_obj)
      });
    });
  });
})
app.listen(3012, function () {
  console.log("Web HOH server listening on port 3012");
});