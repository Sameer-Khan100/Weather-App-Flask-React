import requests
import json
from flask import Flask, abort, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/weather", methods=["GET"])
def weather():
    
    city = request.args.get("city")
    if city is None:
        abort(400, "Missing argument city")

    data = requests.get(
        "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key
    ).json()
    if data == None:
        return {"message":"Error Occurred"}
    try:
        if data["message"] == "city not found":
            return {"message":data["message"]}
    except:
        pass
    weather_forecast = {
        "location": data["name"],
        "weather": {
            "main": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "pressure": data["main"]["pressure"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "icon": get_weather_icon_url(data["weather"][0]["icon"]),
        },
        "sunrise": data["sys"]["sunrise"],
        "sunset": data["sys"]["sunset"],
    }
    return weather_forecast

def get_weather_icon_url(icon_code):
    return f"http://openweathermap.org/img/wn/{icon_code}.png"

@app.route("/", methods=["GET"])
def hello_world():
    return "Hello World"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
