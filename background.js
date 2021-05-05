current_date = new Date();
storage = chrome.storage;

if (location.hostname == "wsm.zinza.com.vn") {
  today = current_date.getDate();
  index = today - 1;
  window.onload = function() {
    today_cell = $("td.current-month:not(.past)").first();
    times = $(today_cell).find(".checktime").children().length;
    if (times == 0) {
      alert("Hôm nay chưa checkin");
    }
    else if (times == 1){
      time_check_in = $(today_cell).find(".checktime").children().first().text();
      hour_check_in = time_check_in.split(":")[0];
      minute_check_in = time_check_in.split(":")[1];
      format_time_check_in = new Date();
      format_time_check_in.setMinutes(minute_check_in);
      format_time_check_in.setHours(hour_check_in);
      timediff = (current_date - format_time_check_in) / 3600000;

      if (timediff > 9) {
        confirm("Hôm nay chưa checkout");
      }
    }
    else {
      storage.sync.set({last_checked_out_day: today});
      storage.sync.set({checked_out: true});
    }
  };
}
else {
  //kiem tra checkin

  storage.local.get(null, function(data) {
    var checked_in = data1.checked_in;
    var last_checked_in_day = data2.last_checked_in_day;
    console.log(data1);
    console.log(data2);

    if (last_checked_in_day != current_date.getDate()) {
      if (checked_in != false) {
        checkin_confirm = confirm("Hôm nay bạn đã check in chưa?");
        if (checkin_confirm) {
          storage.local.set({checked_in: true}, function(){});
          storage.local.set({last_checked_in_day: current_date.getDate()}, function(){});
        }
      }
    }
  });

  //kiem tra checkout
  if (current_date.getHours() >= 18) {

  }
}
