const radios = document.querySelectorAll('*[id^="radio"]'),
  sliders = document.querySelectorAll('*[id^="slider"]');

let cantidad, activeInput;

radios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    activeInput = e.target.id.replace("radio", "slider"),
      activeSlider = document.getElementById(activeInput).parentNode;
    activeSlider.classList.remove("hidden");
    sliders.forEach((s) => {
      if (s.id != activeInput) {
        s.parentNode.classList.add("hidden");
      }
    });
  });
});

function loadLayer(capa, valor) {
  let srcName = capa + "-" + valorTxt[valor],
    file = `datos/${fecha[valor]}-${capa}.geojson`;
  if (!mapa.getSource(srcName)) {
    mapa.addSource(srcName, {
      type: "geojson",
      attribution: atribucion,
      data: file,
    });
  }
  if (!mapa.getLayer(srcName)) {
    (layerObj.id = srcName),
      (layerObj.source = srcName),
      (layerObj.paint["circle-color"] = color[valor]),
      (layerObj.paint["circle-stroke-color"] = color[valor]);
    mapa.addLayer(layerObj);

    mapa.on("click", srcName, (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice(),
        p = e.features[0].properties,
        atrib = {
          name: p["name"] || "N/D",
          cod_sisa: p["ref:sisa_codigo"] || "N/D",
          tipo_sisa: p["ref:sisa_tipologia"] || "N/D",
          id: p["@id"],
        },
        content = `<strong>${atrib.name}</strong></br>Cód. SISA: ${atrib.cod_sisa}</br>Tipo SISA: ${atrib.tipo_sisa}</br><a href='https://www.osm.org/${atrib.id}' target='_blank'>Ver en OpenStreetMap</a></br><a href='#14/${coordinates[1]}/${coordinates[0]}'>acercar</a>`;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({ className: "popup" })
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(mapa);
    });
  }
}

function cleanMap(capa, valor) {
  if (lastLayer != "" && lastLayer != capa + "-" + valorTxt[valor]) {
    mapa.removeLayer(lastLayer);
  }
}

async function countFeatures(capa, valor) {
  let file = `datos/${fecha[valor]}-${capa}.geojson`;
  await fetch(file)
    .then((res) => res.json())
    .then((data) => {
      cantidad = Object.keys(data.features).length;
    })
    .catch((err) => {
      console.error(err);
    });
}

sliders.forEach((slider) => {
  slider.addEventListener("input", (e) => {
    let capa = e.target.id.replace("slider-", ""),
      valor = e.target.value;

    cleanMap(capa, valor);
    loadLayer(capa, valor);
    countFeatures(capa, valor);

    document.getElementById(activeInput)
    .previousElementSibling
    .firstElementChild
    .textContent = `${capa} - ${cantidad} objetos` ;

    lastLayer = capa + "-" + valorTxt[valor];
  });
});
