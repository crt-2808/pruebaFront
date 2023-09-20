import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./navbar";
import Swal from "sweetalert2";
// import { GoogleMap, InfoWindow } from "react-google-maps";
// import Autocomplete from "react-google-maps/lib/components/places/Autocomplete";
// import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";

// import Autocomplete from "react-google-autocomplete";
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 23.3557,
  lng: -99.1845,
};
const PruebaMaps = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPosition, setInfoPosition] = useState(null);
  const [infoContent, setInfoContent] = useState(null);

  const onLoad = (map) => {
    setMap(map);
  };

  const onPlaceChanged = () => {
    if (Autocomplete !== null) {
      const place = Autocomplete.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        if (marker !== null) {
          marker.setPosition(place.geometry.location);
        } else {
          setMarker(
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: map,
            })
          );
        }
        setInfoContent(`${place.name}`);
        setInfoPosition(place.geometry.location);
        setInfoOpen(true);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <div className="fluid">
      <Navbar style={{ backgroundColor: "#F1F5F8" }}></Navbar>
      <div>
        <LoadScript
          googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
          libraries={["places"]}
        >
          <Autocomplete
            onLoad={(autocomplete) => autocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <input type="text" placeholder="Enter an address" />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {marker && (
              <InfoWindow
                position={infoPosition}
                onCloseClick={() => setInfoOpen(false)}
                visible={infoOpen}
              >
                <p>{infoContent}</p>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};
export default PruebaMaps;
