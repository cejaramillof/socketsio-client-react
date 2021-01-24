import React, { useEffect, useContext } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { SocketContext } from './../../context/SocketContext';

const puntoInicial = {
  lng: -122.4725,
  lat: 37.8010,
  zoom: 13.5
}

export const MapaPage = () => {
  const { mapaDiv, setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key);
      }
    });
  }, [socket, agregarMarcador])

  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador);
    });
  }, [nuevoMarcador$, socket]);

  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      socket.emit('marcador-actualizado', marcador);
    });
  }, [socket, movimientoMarcador$]);

  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador);
    })
  }, [socket, actualizarPosicion])

  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador])

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
