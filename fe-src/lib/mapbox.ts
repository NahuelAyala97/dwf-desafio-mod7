import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

function mapBox(container: HTMLElement, location?) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  //creo el mapa y lo configuro
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: location ? [location.lng, location.lat] : [-58.382, -34.6238], // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  //adidiciono buscador, controlers, fullscreen
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      language: "es",
      marker: false,
    })
  );
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(
    new mapboxgl.FullscreenControl({
      container: container,
    })
  );

  //creo el marcador
  const marker = new mapboxgl.Marker({
    draggable: true,
  });

  //escucho el evento para tomar geoloc,
  //cuando el marcador este en la posicion final
  // y dispara evento con los datos
  marker.on("dragend", async (e) => {
    const geoData = marker.getLngLat();
    const placeName = await geoCodingReverse(geoData.lng, geoData.lat);
    container.dispatchEvent(
      new CustomEvent("location", {
        bubbles: true,
        detail: { geoData, placeName },
      })
    );
  });

  //si tengo una location pre-existente la dibujo primero
  if (location) {
    marker.setLngLat([location.lng, location.lat]).addTo(map);
  }

  //cuando hacen click, se adiciona el marcador
  // y dispara evento con los datos
  map.on("click", async (e) => {
    marker.remove();
    marker.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
    const placeName = await geoCodingReverse(e.lngLat.lng, e.lngLat.lat);

    container.dispatchEvent(
      new CustomEvent("location", {
        bubbles: true,
        detail: { geoData: marker.getLngLat(), placeName },
      })
    );
  });
}

async function geoCoding(location: string) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?limit=1&language=es&access_token=${MAPBOX_TOKEN}
    `
  );
  const data = await response.json();
  const coordenadas = data.features[0].center;
  const placeName = data.features[0].place_name;
  return {
    placeName,
    geoloc: {
      lat: coordenadas[1],
      lng: coordenadas[0],
    },
  };
}

async function geoCodingReverse(lng, lat) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?language=es&access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  let localidad;
  let provincia;
  for (const feature of data.features) {
    if (feature["place_type"] == "place") {
      localidad = feature.text;
    }
    if (feature["place_type"] == "region") {
      provincia = feature.text;
    }
  }

  return `${localidad}, ${provincia}`;
}

export { mapBox, geoCoding, geoCodingReverse };
