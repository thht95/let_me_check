current_date = new Date();
storage = chrome.storage;

if (location.hostname == "wsm.zinza.com.vn") {
  today = current_date.getDate();
  index = today - 1;
  $(document).ready(function () {
    setTimeout(function() {
      today_cell = $("td.current-month:not(.past)").first();
      times = $(today_cell).find(".checktime").children().length;
      if (times == 0) {
        cf_check_in = confirm("Hôm nay chưa checkin. Bạn muốn checkin luôn không?");
        if (cf_check_in) {
          if ($(".float-right > a").length > 0) {
            $.ajax({
              type: "POST",
              url: "https://wsm.zinza.com.vn/user/working_times",
              success: function () {
                alert("Checkin success. Reload browser pls!");
              },
              error: function () {
                alert("Something went wrong. Pls checkin manually");
              }
            });

            storage.local.set({ checked_in: true }, function () { });
            storage.local.set({ last_checked_in_day: current_date.getDate() }, function () { });
          }
        }
      }
      else if (times == 1) {
        time_check_in = $(today_cell).find(".checktime").children().first().text();
        hour_check_in = time_check_in.split(":")[0];
        minute_check_in = time_check_in.split(":")[1];
        format_time_check_in = new Date();
        format_time_check_in.setMinutes(minute_check_in);
        format_time_check_in.setHours(hour_check_in);
        timediff = (current_date - format_time_check_in) / 3600000;

        if (timediff > 9) {
          cf_checkout = confirm("Hôm nay chưa checkout. Bạn có muốn checkout luôn không?");
          if (cf_checkout) {
            if ($(".float-right > a").length > 0) {
              href = $(".float-right > a")[0].href;
              $.ajax({
                type: "PATCH",
                url: href,
                success: function () {
                  alert("Checkout success. Reload browser pls!");
                },
                error: function () {
                  alert("Something went wrong. Pls checkout manually");
                }
              });

              storage.local.set({ checked_out: true }, function () { });
              storage.local.set({ last_checked_out_day: current_date.getDate() }, function () { });
            }
          }
        }
      }
      else {
        storage.local.set({ checked_out: true }, function () { });
        storage.local.set({ last_checked_out_day: current_date.getDate() }, function () { });
      }
    }, 1000);
  });
}
else {
  homnaylathumay = current_date.getDay();
  if (![0, 6].includes(homnaylathumay)) {
    //kiem tra checkin
    storage.local.get(null, function (data) {
      var checked_in = data.checked_in;
      var last_checked_in_day = data.last_checked_in_day;

      console.log("checked_in", checked_in);
      console.log("last_checked_in_day", last_checked_in_day);

      if (last_checked_in_day == current_date.getDate() && checked_in) {
        //thank god. i dont have to do anything here
      }
      else {
        checkin_confirm = confirm("Hôm nay bạn đã check in chưa?");
        if (checkin_confirm) {
          storage.local.set({ checked_in: true }, function () { });
          storage.local.set({ last_checked_in_day: current_date.getDate() }, function () { });
        }
      }
    });

    //kiem tra checkout
    if (current_date.getHours() >= 18) {
      storage.local.get(null, function (data) {
        var checked_out = data.checked_out;
        var last_checked_out_day = data.last_checked_out_day;

        console.log("checked_out", checked_out);
        console.log("last_checked_out_day", last_checked_out_day);

        if (last_checked_out_day != current_date.getDate()) {
          if (checked_out != false) {
            checkin_confirm = confirm("Hôm nay bạn đã check out chưa?");
            if (checkin_confirm) {
              storage.local.set({ checked_out: true }, function () { });
              storage.local.set({ last_checked_out_day: current_date.getDate() }, function () { });
            }
          }
        }
      });
    }
  }
}
