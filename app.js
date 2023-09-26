require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const https = require("https");
const KEY = process.env.KEY;
let weather = {};

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", {
    error: "",
  });
});


app.post("/", (req, res) => {
  const { city } = req.body;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`;

  https.get(url, (apiResponse) => {
    if (apiResponse.statusCode != 200) {
        // console.log(apiResponse.statusCode);
        res.render("home", {
        error: "Oops! There seems to be some error, Please try again!",
      });
    } else {
        
      apiResponse.on("data", (apiData) => {
        const data = JSON.parse(apiData);
        
        weather = {
            id:data.id,
          city: data.name,
          country: data.sys.country,
          coordinates: {
            longitude: data.coord.lon,
            latitude: data.coord.lat,
          },
          temp: {
            currentTemp: data.main.temp,
            humidity: data.main.humidity,
            feels_like: data.main.feels_like,
          },
          weatherDescription: {
            title: data.weather[0].main,
            description: data.weather[0].description.toUpperCase(),
            icon: data.weather[0].icon,
          },
          current_date: {
            day: {
              dayArray: [
                `Sunday`,
                `Monday`,
                `Tuesday`,
                `Wednesday`,
                `Thursday`,
                `Friday`,
                `Saturday`,
              ],
              dayNum: new Date().getDay(),
            },
            date: new Date().getDate(),
            month: {
              monthArray: [
                `January`,
                `February`,
                `March`,
                `April`,
                `May`,
                `June`,
                `July`,
                `August`,
                `September`,
                `October`,
                `November`,
                `December`,
              ],
              monthNum: new Date().getMonth(),
            },
            year: new Date().getFullYear(),
          },
        };
        res.redirect("/" + weather.id);
        
      });
    }
  });
});

app.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    if(weather.id === id){
        res.render("data", {
            city: weather.city + ",",
            country: weather.country,
            coordinates: {
              latitude: weather.coordinates.latitude,
              longitude: weather.coordinates.longitude,
            },
            temp: weather.temp.currentTemp + "°C",
            humidity: weather.temp.humidity + "%",
            realFeel: weather.temp.feels_like + "°C",
            description: {
              title: weather.weatherDescription.title,
              main_description: weather.weatherDescription.description,
              icon: `https://openweathermap.org/img/wn/${weather.weatherDescription.icon}@2x.png`,
            },
            date: {
              day:
                weather.current_date.day.dayArray[
                  weather.current_date.day.dayNum
                ] + ",",
              date: weather.current_date.date,
              month:
                weather.current_date.month.monthArray[
                  weather.current_date.month.monthNum
                ],
              year: weather.current_date.year,
            },
            error: "",
          });
    } else{
        res.redirect("/");
    }
    

})

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server started on PORT: ${port}`);
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

startServer();
