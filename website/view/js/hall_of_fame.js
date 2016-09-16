var toggle_visibility = function (id) {
  selector = "#tweet_text" + id;
  console.log($(selector), $(selector).attr('style'));
  var now = $(selector).attr('style')
  console.log(now);
  if(now == "" )
  $(selector).hide();
  else
  $(selector).show();
}
$(function () {
  $.ajax({
    type: "GET",
    url: "/hall",
    contentType: "application/json; charset=utf-8",
    crossDomain: true,
    success: function (data) {
      $(".result").html(data);
      console.log(data);
      var r = new Array(),
        j = -1;
      for (var key = 0, size = data.length; key < size; key++) {
        if(!data[key]["profile_pic"])
        data[key]["profile_pic"] = "http://digitalspyuk.cdnds.net/14/08/160x160/square_talking-angela-app-warning.jpg";
        r[++j] = '<div class="col-xs-6 col-sm-2 placeholder"> <img src="' + data[key]["profile_pic"] + '" width="160" height="160" class="img-responsive" alt="Generic placeholder thumbnail">';
        r[++j] = '<h4>' + data[key]["data_screen_name"] + '</h4>';
        r[++j] = '<h3>#' + parseInt(key + 1) + '</h3>';
        r[++j] = '<h5>H-Score: ' + parseInt(Math.round(parseInt(data[key]["neg"]) * 10000 / parseInt(data[key]["all_total"])) / 100) + '</h5>';
        r[++j] = '<p class="text-muted">Total negative Tweet: ' + data[key]["neg"] + '</p>';
        r[++j] = '<p class="text-muted">Total positive Tweet: ' + data[key]["pos"] + '</p>';
        r[++j] = '<button class="btn btn-danger" id="show_tweet' + key + '" onclick="toggle_visibility(' + key + ')">View Latest Tweet</button>';
        r[++j] = '<p class="text-muted" id="tweet_text' + key + '" style="display :none" >' + data[key]["last_tweet"] + '</p></div>';
      }
      $('#main-body').append(r.join(''));
    }
  });
});

