const searchForm = $(".searchForm");
const citySearch = $(".citySearch");
const UVindexList = $(".UVindexList");
/* let citySearchStorage = sessionStorage.getItem("city name");
console.log("city name", citySearchStorage); */
/* if (citySearchStorage === "") {
  citySearch.val(citySearchStorage);
} */

const historyArray = [];

function onSearchClick() {
  clearDisplay();
  const cityQuery = citySearch.val();
  const currentQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityQuery +
    "&appid=39396cbe65ca20ac56da20de7be724d3";
  const fiveDayURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityQuery +
    "&appid=39396cbe65ca20ac56da20de7be724d3";
  sessionStorage.setItem("city name", cityQuery);

  $.ajax({
    url: currentQueryURL,
  })
    .then(function (response) {
      UVIndexRetrieve(response);
      currentDisplay(response);
      console.log("response", response);
    })
    .catch(function () {
      alert("Please Enter a Valid City");
    });

  $.ajax({
    url: fiveDayURL,
  })
    .then(function (fiveDay) {
      fiveDayDisplay(fiveDay);
    })
    .catch(function () {
      console.log("Not a valid city");
    });

  function UVIndexRetrieve(response) {
    const cityLat = response.coord.lat.toString();
    const cityLon = response.coord.lon.toString();
    const UVindexURL =
      "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&appid=39396cbe65ca20ac56da20de7be724d3";

    $.ajax({
      url: UVindexURL,
    }).then(function (UVindex) {
      UVindexDisplay(UVindex);
    });
  }
  if ($(".citySearch").val() !== historyArray) {
    historyArray.push(cityQuery);
  }
  $(".citySearch").val("");
}
searchForm.submit(function (event) {
  event.preventDefault();
  onSearchClick();
  historyButtons();
});

function UVindexDisplay(UVindex) {
  const UVindexVal = UVindex.value;
  UVindexList.append("UV Index : " + UVindexVal);
  if (UVindexVal < 3) {
    UVindexList.addClass("greenUV");
  } else if (UVindexVal > 3 && UVindexVal < 6) {
    UVindexList.addClass("orangeUV").removeClass("greenUV");
  } else {
    UVindexList.addClass("redUV").removeClass("greenUV orangeUV");
  }
}

function currentDisplay(response) {
  $(".currentHead").text("Current Weather In " + response.name);
  let currentResults =
    "<li class='temperatureList'>" +
    "Temperature : " +
    Math.floor(response.main.temp - 273.15) +
    " °C";
  currentResults +=
    "<li class='humidityList'>" +
    "Humidity : " +
    response.main.humidity +
    "%" +
    "</li>";
  currentResults +=
    "<li class='windSpeedList'>" +
    "Wind Speed : " +
    response.wind.speed +
    " MPH";
  +"</li>";
  $(".displayList").append(currentResults);
}

function historyButtons() {
  const lastButton = historyArray[historyArray.length - 1];
  let searchHistoryButton =
    "<button class='searchHistory'>" + lastButton + "</button>";
  $(".historyContainer").append(searchHistoryButton);
}

function fiveDayDisplay(fiveDay) {
  const cardInfo = fiveDay.list;
  $(".fiveForecast").append(
    "<h2 class='fiveHeader'> " + "Five Day Forecast" + "</h2>"
  );
  for (let selector = 0; selector < cardInfo.length; selector++) {
    if (cardInfo[selector].dt_txt.includes("12:00:00")) {
      let cardDate = cardInfo[selector].dt_txt;
      let cardTemp = cardInfo[selector].main.temp;
      let cardHumidity = cardInfo[selector].main.humidity;
      let cardCreate =
        "<div class='coreyCard'>" +
        "<h6 class='cardDate'>" +
        cardDate.slice(0, 10) +
        "</h6>";
      cardCreate +=
        "<h6 class = 'cardTemp'>" +
        "Temp:" +
        Math.floor(cardTemp - 273.15) +
        " °C " +
        "</h6>";
      cardCreate +=
        "<h6 class=' cardHumidity'>" +
        "Humidity:" +
        cardHumidity +
        "%" +
        "</h6>" +
        "</div>";
      $(".fiveForecast").append(cardCreate);
      localStorage.setItem("firstChoice", cardCreate);
    }
  }
}

const searchHistorySubmission = $(".searchHistory");

$(".historyContainer").on("click", function () {
  clearDisplay(event);
  const lastItem = historyArray[historyArray.length - 1];
  if ($(".searchHistory").text().includes(lastItem)) {
    $(".citySearch").val(lastItem);
    onSearchClick();
  }
});

function clearDisplay(event) {
  $("ul").text("");
  $(".fiveForecast").empty();
  $(".UVindexList").empty();
}
function clearDisplayButton(event) {
  $("ul").text("");
  $(".fiveForecast").empty();
  $(".UVindexList").empty();
  $(".citySearch").val("");
}
/*console.log($(".citySearch").val()); */

/* if ($(this).hasClass("searchHistory")) {
  console.log($(".citySearch").val($(this).text().trim()));
  UVindexDisplay();
} else {
} */
