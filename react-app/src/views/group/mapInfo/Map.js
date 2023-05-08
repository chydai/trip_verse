import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import { GoogleMapsAPI } from './client-config';
import { MarkerF } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { selectAllPlaces, addNewPlace } from '../../../store/preTripPlaceSlice';
import { useDispatch } from 'react-redux';
import Geocode from 'opencage-api-client';

import EditableCard from '../tripplanner/PreTrip/EditableCard';
const containerStyle = {
  width: '2050px',
  height: '300px',
};

function Map() {
  const [center, setCenter] = useState({
    lat: 39.3299,
    lng: -76.6498,
  });
  // const [position, setPosition] = useState({
  //   lat: 39.3299,
  //   lng: -76.6498,
  // });
  const apiKey =  'AIzaSyCbe2Jbk_pYrdl08f3R4cqka-25oj_kXBc';
  const libraries = ['places'];
  const language = 'en';

  const [searchValue, setSearchValue] = useState('');

  const placeList = useSelector(selectAllPlaces);
  console.log('placelist!! :', placeList);
  const dispatch = useDispatch();
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (placeList.length > 0 && window.google) {
      const geocoder = new window.google.maps.Geocoder();

      Promise.all(
        placeList.map((place) => {
          return new Promise((resolve, reject) => {
            if (place.position) {
              resolve(place.position);
            } else {
              geocoder.geocode({ address: place.name }, (results, status) => {
                if (status === 'OK') {
                  console.log("results:",results);
                  const { lat, lng } = results[0].geometry.location;
                  const newPosition = { lat: lat(), lng: lng() };
                  resolve(newPosition);
                } else {
                  console.log(
                    'Geocode was not successful for the following reason: ' +
                      status
                  );
                }
              });
            }
          });
        })
      ).then((newMarkers) => {
        console.log('newMarkers', newMarkers);
        setMarkers(newMarkers);
      });
    } else {
      setMarkers([]);
    }
  }, [placeList]);

  const markerRef = useRef(null);
  const autoCompleteRef = useRef(null);
  // const onMarkerDragEnd = (event) => {
  //   const newPosition = {
  //     lat: event.latLng.lat(),
  //     lng: event.latLng.lng(),
  //   };

  //   console.log('newPosition', newPosition);
  //   setPosition(newPosition);
  //   markerRef.current.setPosition(newPosition);
  // };

  const onPlaceChanged = () => {
    // const place = autoCompleteRef.current.getPlace();
    // console.log('place', place);
    // if (place.geometry) {
    //   const newPlace = {
    //     lat: place.geometry.location.lat(),
    //     lng: place.geometry.location.lng(),
    //   };
    //   setPosition(newPlace);
    //   setSearchValue(place.formatted_address);
    //   markerRef.current.setPosition(place.geometry.location);
    // }
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
          note: '',
          planId: localStorage.getItem('planId'),
          imgUrl: undefined,
          // position: newPosition,
        })
      );
      setCenter(newPosition);
    }
  };

  const onAutoCompleteLoad = (autoComplete) => {
    console.log(autoComplete);
    autoCompleteRef.current = autoComplete;
    console.log('autoCompleteRef.current', autoCompleteRef.current);
    autoComplete.addListener('place_changed', onPlaceChanged);
  };

  const onSearchBoxChange = (event) => {
    setSearchValue(event.target.value);
  };

  // const onMarkerLoad = (marker) => {
  //   markerRef.current = marker;
  // };

  return (
    <LoadScript  googleMapsApiKey={`${apiKey}&language=${language}`} libraries={['places']}>
      <div style={{ height: '300px', width: '100%' }}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2.2}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}

          {/* <MarkerF
            position={position}
            draggable={true}
            ref={markerRef}
            onLoad={onMarkerLoad}
            onDragEnd={onMarkerDragEnd}
          /> */}
          <Autocomplete onLoad={onAutoCompleteLoad}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                padding: '10px',
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
                  position: 'absolute',
                  left: '90%',
                  marginLeft: '0px',
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
    </LoadScript>
  );
}
export default Map;
