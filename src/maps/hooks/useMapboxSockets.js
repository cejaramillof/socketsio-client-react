import { useEffect, useContext } from 'react'
import { SocketContext } from './../../context/SocketContext';

export const useMapboxSockets = (agregarMarcador, actualizarPosicion, nuevoMarcador$, movimientoMarcador$) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key);
      }
    });
  }, [socket, agregarMarcador])

  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => agregarMarcador(marcador, marcador.id));
  }, [socket, agregarMarcador])

  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => actualizarPosicion(marcador))
  }, [socket, actualizarPosicion])

  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => socket.emit('marcador-nuevo', marcador));
  }, [nuevoMarcador$, socket]);

  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => socket.emit('marcador-actualizado', marcador));
  }, [socket, movimientoMarcador$]);

  return;
}

export default useMapboxSockets
