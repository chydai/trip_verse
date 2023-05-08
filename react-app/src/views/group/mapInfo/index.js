import React from "react";

// assets
import MainCard from "ui-component/cards/MainCard";
import Map from "./Map";
// ==============================|| MAIN LAYOUT ||============================== //

const MapInfo = () => {
  return (
    <MainCard title="Map">
      <Map
        center={{ lat: 39.2904, lng: -76.6122 }}
        zoom={18}
      />
    </MainCard>
  );
};

export default MapInfo;
