import { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2xlcml0aCIsImEiOiJja2dzOHdteDkwM2tnMndxMWhycnY3Ymh3In0.Zis8hP6HuwcywtgUhfeZoQ';

export const useMapbox = (puntoInicial) => {
  const [coords, setCoords] = useState(puntoInicial);
  const mapaDiv = useRef();
  const mapa = useRef();
  const marcadores = useRef({});
  const movimientoMarcador = useRef(new Subject());
  const nuevoMarcador = useRef(new Subject());

  const setRef = useCallback((node) => {
    mapaDiv.current = node;
  }, []);

  const agregarMarcador = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();

    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true);

    marcadores.current[marker.id] = marker;

    if (!id) {
      nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
      });
    }

    marker.on('drag', ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      movimientoMarcador.current.next({ id, lng, lat });
    });
  }, [])

  const actualizarPosicion = useCallback(({ id, lng, lat }) => {
    marcadores.current[id].setLngLat([lng, lat]);
  }, [])

  useEffect(() => {
    // const map = new mapboxgl.Map({ ... })
    // setMapa(map);
    mapa.current = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom
    });
  }, [puntoInicial]);

  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    });
    return mapa.current?.off('move');
  }, []);

  useEffect(() => {
    mapa.current?.on('click', agregarMarcador);
    return mapa.current?.off('click');
  }, [agregarMarcador]);

  return {
    agregarMarcador,
    actualizarPosicion,
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
    mapaDiv,
    setRef,
  }
}
