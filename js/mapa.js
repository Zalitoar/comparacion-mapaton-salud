const atribucion =
  "<a href='https://wiki.openstreetmap.org/wiki/ES:Argentina/COVID-19#Fuentes_de_datos' target='_blank'>fuentes de datos de salud</a>";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemFsaXRvYXIiLCJhIjoiYVJFNTlfbyJ9.mPX8qTsRUGOOETl0CtA-Pg";
const mapa = new mapboxgl.Map({
  container: "map",
  style: "js/mapbox-dark-v10.json",
  center: [-65.2, -37.9],
  zoom: 3,
  hash: true
});

const fecha = ["2020-05-07", "2020-05-12", "2021-11-22"],
  valorTxt = ["antes", "mapaton", "hoy"],
  color = ["#d1d005", "#d12b05", "#0805cd"]
  osmUrl = 'https://www.openstreetmap.org/';

let layerObj = {
  id: null,
  type: "circle",
  source: null,
  layout: {
    visibility: "visible",
  },
  paint: {
    "circle-radius": 4,
    "circle-color": null,
    "circle-stroke-color": null,
    "circle-stroke-width": 0.2,
    "circle-opacity": 0.8,
  },
  filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"]],
},
lastLayer = '';
