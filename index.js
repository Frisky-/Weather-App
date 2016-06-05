var weather = (function() {
  var key = "4f978a618c404048dfd8fc590db915a8";

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $.ajax({
          url: "https://api.forecast.io/forecast/" + key + "/" + latitude + "," + longitude,
          dataType: "jsonp",
          success: function(data) {
            $(".location").html(data.timezone.split("/")[1]);
            $(".summary").html(data.currently.summary);
            $(".hourly-summary").html(data.hourly.summary);
            changeUnit(data.currently.temperature);
            createWeatherIcon(data.currently.icon);
            setBackgroundImage(data.currently.temperature, data.currently.summary);
          }
        })
      });
    } else {
      console.log("geolocation is not supported");
    }
  }

  function currentTime() {
    setInterval(function() {
      var time = new Date().getTime();
      if (time) {
        $(".time").html(moment(time).format("LTS"));
      }
    }, 1000);
  }


  function createWeatherIcon(iconName) {
    var skycons = new Skycons({
      "color": "black"
    });
    skycons.set("icon1", iconName);
    skycons.play();
  }

  function changeUnit(temp) {
    $('input[name="unit-checkbox"]').bootstrapSwitch({
      onText: "C",
      offText: "F",
      onValue: "C",
      onColor: "info",
      offColor: "info"
    });
    var value = $(".unit-checkbox")[0].checked;
    if (value === true) {
      return $(".temp").html(Math.round((temp - 32) * 5 / 9));
    } else {
      return $(".temp").html(Math.round(temp * 9 / 5) + 32);
    }
  }

  function setBackgroundImage(temp, summary) {
    if (temp >= 86) {
      $("body").css("background", "url('http://hdwallpaperbackgrounds.net/wp-content/uploads/2015/11/Desert-HD-Wallpapers.jpg')");
    } else if (summary === "Drizzle") {
      $("body").css("background-image", "url('http://www.10wallpaper.com/wallpaper/1920x1200/1306/Drizzle-Life_photography_HD_wallpaper_1920x1200.jpg')");
    } else if (summary === "Mostly Cloudy" || summary === "Partly Cloudy" || summary === "Overcast") {
      $("body").css("background-image", "url('http://hdlatestwallpapers.com/wp-content/uploads/2013/11/Tree-Under-Cloudy-Sky-Nature-Hd-Wallpaper.jpg')");
    } else if (summary === "Rain" || summary === "Light Rain") {
      $("body").css("background-image", "url('http://webneel.com/wallpaper/sites/default/files/images/04-2013/creative-rain_0.jpg')");
    } else if (temp <= 41 || summary === "Snow" || summary === "Light Snow") {
      $("body").css("background-image", "url('http://www.hdnicewallpapers.com/Walls/Big/Winter/Amazing_HD_Wallpaper_of_Winter_Season.jpg')");
    } else {
      $("body").css("background-image", "url('http://images.forwallpaper.com/files/images/3/352f/352f58d8/811695/scotland-loch-cluanie.jpg')");
    }
  }

  return {
    init: function() {
      currentTime();
      getLocation();
    },
    changeUnit: changeUnit
  };

}());


$(window).load(function() {
  weather.init();
  $(".unit-checkbox").on("switchChange.bootstrapSwitch", function(e, state) {
    var temp = $(".temp").html();
    weather.changeUnit(temp);
  });
});
