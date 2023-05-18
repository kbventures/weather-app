import Head from "next/head";
import * as React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type WeatherAPI from "../types/main.d";
import type {GeoLocation} from "../types/main.d";
import { format } from "date-fns";

const defaultUrl=
  "https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13"
;

export default function Home() {
  const theme = useTheme();

  const [weather, setWeather] = useState<undefined | WeatherAPI>(undefined);
  const [location, setLocation] = useState<undefined | GeoLocation>(undefined);

  const options: RequestInit = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c3c48d1f5emsh1d70c25085a9a06p1554d6jsnce958caf6dab",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  useEffect(() => {
    if ("geolocation" in window.navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  async function fetchCurrentWeather() {
    if (!location) return;
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location.latitude}%2${location.longitude}`;
    try {
      const [
        APIResponse,
        DefaultAPIResponse,
      ] = await Promise.all([fetch(url, options), fetch(defaultUrl, options)]);
      
      const [JsonAPIData, JsonAPIDataDefault] = await Promise.all([
        APIResponse.json(),
        DefaultAPIResponse.json(),
      ]);

      if (JsonAPIData.error) {
        setWeather(JsonAPIDataDefault);
        // console.log(weather);
      } else {
        setWeather(JsonAPIData);
      }
    } catch (e) {
      console.error("error:" + e);
    }
  }

  useEffect(() => {
    // Fetch data from API if `location` object is set
    if (location) {
      fetchCurrentWeather();
    }
  }, [location]);
  console.log(weather);



  // TODO CREATE LOADING PAGE
  if (!weather) {
    return "Loading...";
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="lg">
        {/* <Box
          sx={{
            my: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            width: "fit-content",
            padding: "12px 37px 18px 28px",
          }}
        >
          <Typography component="p" color="common.white">
            Sat 22
            {weather ? weather.location.localtime : ""}
          </Typography>

          <Box sx={{ width: "fit-content", display: "flex", gap: "7px" }}>
            <Image
              height="64"
              width="64"
              alt=""
              src="http://cdn.weatherapi.com/weather/64x64/day/116.png"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ fontWeight: "600" }}
                component="p"
                color="common.white"
              >
                56°
              </Typography>
              <Typography component="p" color="common.white">
                46°
              </Typography>
            </Box>
          </Box>
        </Box> */}

        <Typography>
          {weather.location.name},{weather.location.region},
          {weather.location.country}
        </Typography>
        <Typography>{format(new Date(weather.location.localtime), "h:mm a")}</Typography>
      
        <Image
              height="64"
              width="64"
              alt=""
              src={`http:${weather.current.condition.icon}`}
            />
          <Typography>17c</Typography>

          <Box>
            <Typography>{weather.current.condition.text}</Typography>
            <Typography> Feels like {weather.current.feelslike_c}</Typography>
          </Box>

          <Box>
          <Typography>Wind {weather.current.wind_kph} km/h</Typography>
          <Typography> Feels like {weather.current.feelslike_c}</Typography>
          </Box>
        
      
      </Container>
    </>
  );
}

