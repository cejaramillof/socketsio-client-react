import { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2xlcml0aCIsImEiOiJja2dzOHdteDkwM2tnMndxMWhycnY3Ymh3In0.Zis8hP6HuwcywtgUhfeZoQ';

export const useMapbox = (puntoInicial) => {
  const mapaDiv = useRef();
  const setRef = useCallback((node) => {
    mapaDiv.current = node;
  }, []);

  const marcadores = useRef({});

  const movimientoMarcador = useRef(new Subject());
  const nuevoMarcador = useRef(new Subject());

  const mapa = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  const agregarMarcador = useCallback((ev) => {
    const { lng, lat } = ev.lngLat;

    const marker = new mapboxgl.Marker();
    marker.id = v4(); // TODO: si el marcador ya tiene ID

    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true);

    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker;

    // TODO: si el marcador tiene ID no emitir
    nuevoMarcador.current.next({
      id: marker.id,
      lng,
      lat
    });

    marker.on('drag', ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      movimientoMarcador.current.next({ id, lng, lat });
    });
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom
    });
    mapa.current = map;
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
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
    setRef
  }
}
