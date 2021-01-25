import React, { useEffect, useContext } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { useMapboxSockets } from './../hooks/useMapboxSockets';
const puntoInicial = {
  lng: -122.4725,
  lat: 37.8010,
  zoom: 13.5
}

export const MapaPage = () => {
  const { mapaDiv, setRef, coords, nuevoMarcador$,
    movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial);
  useMapboxSockets(agregarMarcador, actualizarPosicion, nuevoMarcador$, movimientoMarcador$)

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div
        // ref={mapaDiv}
        ref={mapaDiv}
        className="mapContainer"
      />
    </>
  )
}
