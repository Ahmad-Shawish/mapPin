import Map, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import "mapbox-gl/dist/mapbox-gl.css";
import StarIcon from "@mui/icons-material/Star";
import "./app.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [err, setErr] = useState("");

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    const lat = e.lngLat.lat;
    const long = e.lngLat.lng;
    setNewPlace({ lat, long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser == null) {
      setErr("Log in first");
    } else {
      const newPin = {
        username: currentUser,
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long,
      };

      try {
        const res = await axios.post("/pins", newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          longitude: 15,
          latitude: 45,
          zoom: 4,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <div key={p._id}>
            <Marker longitude={p.long} latitude={p.lat}>
              <RoomIcon
                style={{
                  fontSize: 40,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="starts">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setNewPlace(null);
              setErr(null);
            }}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
                {err ? <p>{err}</p> : ""}
              </form>
            </div>
          </Popup>
        )}
      </Map>
      <div className="container">
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="sign">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;
