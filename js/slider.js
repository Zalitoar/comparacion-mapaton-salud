const radios = document.querySelectorAll('*[id^="radio"]'),
  sliders = document.querySelectorAll('*[id^="slider"]');
radios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    let activeInput = e.target.id.replace("radio", "slider"),
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
      const coordinates = e.features[0].geometry.coordinates.slice();
      const p = e.features[0].properties;
      const atrib = {
        name: p["name"] || "N/D",
        cod_sisa: p["ref:sisa_codigo"] || "N/D",
        tipo_sisa: p["ref:sisa_tipologia"] || "N/D",
        id: p["@id"],
      };

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<strong>${atrib.name}</strong></br>Cód. SISA: ${atrib.cod_sisa}</br>Tipo SISA: ${atrib.tipo_sisa}</br><a href='https://www.osm.org/${atrib.id}' target='_blank'>Ver en OpenStreetMap</a></br><a href='#14/${coordinates[1]}/${coordinates[0]}'>acercar</a>`
        )
        .addTo(mapa);
    });
  }
}

function cleanMap(capa, valor) {
  //console.log(lastLayer + ' ' + capa + '-' + valorTxt[valor])
  if (lastLayer != "" && lastLayer != capa + "-" + valorTxt[valor]) {
    mapa.removeLayer(lastLayer);
  }
  /*  valorTxt.forEach((v) => {
    if (v != valorTxt[valor]) {
      let capaTxt = capa + "-" + v;
      if (mapa.getLayer(capaTxt)) {
        mapa.removeLayer(capaTxt);
      }
    }
  }); */
}

sliders.forEach((slider) => {
  slider.addEventListener("input", (e) => {
    let capa = e.target.id.replace("slider-", ""),
      valor = e.target.value;

    cleanMap(capa, valor);
    loadLayer(capa, valor);

    lastLayer = capa + "-" + valorTxt[valor];
  });
});
