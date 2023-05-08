import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { addNewPlace } from "../../../store/preTripPlaceSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { fetchAllPlan } from "store/preTripPlanSlice";
import axios from "axios";
import { useSelector } from "react-redux";

const containerStyle = {
  width: "2050px",
  height: "300px",
};

const libraries = ["places"];

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCbe2Jbk_pYrdl08f3R4cqka-25oj_kXBc",
    libraries: libraries,
    language: "en",
  });

  const [center, setCenter] = useState({
    lat: 39.3299,
    lng: -76.6498,
  });
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const [markers, setMarkers] = useState([]);
  const [placeList, setPlaceList] = useState([]);

  const curRoute = useParams();
  const channelId = curRoute.channelid;
  const url = process.env.REACT_APP_BASE_URL + "/place";

  const placeStatus = useSelector((state) => state.preTripPlace.status);

  useEffect(() => {
    const fetchPlaces = async (planId) => {
      const response = await axios.get(`${url}/all/${planId}`);
      return response.data;
    };

    if (channelId && placeStatus == "idle") {
      dispatch(fetchAllPlan(channelId))
        .then((newPlan) => {
          const planIds = newPlan.payload.map((plan) => plan._id);
          return planIds;
        })
        .then(async (planIds) => {
          const promises = planIds.map((planId) => fetchPlaces(planId));
          const places = await Promise.all(promises);
          console.log(places.flat());
          setPlaceList(places.flat());
        });
    }
  }, [channelId, dispatch, placeStatus]);

  useEffect(() => {
    if (placeList.length > 0 && window.google && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();

      Promise.all(
        placeList.map((place) => {
          return new Promise((resolve, reject) => {
            if (place.position) {
              resolve(place.position);
            } else {
              geocoder.geocode({ address: place.name }, (results, status) => {
                if (status === "OK") {
                  const { lat, lng } = results[0].geometry.location;
                  const newPosition = { lat: lat(), lng: lng() };
                  resolve(newPosition);
                } else {
                  console.error(
                    "Geocode was not successful for the following reason: " +
                      status
                  );
                }
              });
            }
          });
        })
      ).then((newMarkers) => {
        setMarkers(newMarkers);
      });
    } else {
      setMarkers([]);
    }
  }, [placeList]);

  const autoCompleteRef = useRef(null);

  const onPlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    if (place.geometry) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSearchValue(place.formatted_address);
      dispatch(
        addNewPlace({
          name: place.formatted_address,
          note: "",
          planId: localStorage.getItem("planId"),
          imgUrl: undefined,
        })
      );
      setCenter(newPosition);
    }
  };

  const onAutoCompleteLoad = (autoComplete) => {
    autoCompleteRef.current = autoComplete;
    autoComplete.addListener("place_changed", onPlaceChanged);
  };

  const onSearchBoxChange = (event) => {
    setSearchValue(event.target.value);
  };

  return isLoaded ? (
    <div style={{ height: "300px", width: "100%" }}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}

        <Autocomplete onLoad={onAutoCompleteLoad}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              padding: "10px",
            }}
          >
            <input
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `-10 10px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "90%",
                marginLeft: "0px",
              }}
              type="text"
              placeholder="Search for location"
              value={searchValue}
              onChange={onSearchBoxChange}
            />
          </div>
        </Autocomplete>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default Map;
