const radios = document.querySelectorAll('*[id^="radio"]'),
  sliders = document.querySelectorAll('*[id^="slider"]');

let cantidad, rels, vias, nodos, activeInput;

radios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    (activeInput = e.target.id.replace("radio", "slider")),
      (activeSlider = document.getElementById(activeInput).parentNode);
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
          timestamp: new Date(p["@timestamp"]).toUTCString(),
          changeset: p["@changeset"],
          version: p["@version"],
        },
        fechaPrefix = atrib.version > 1 ? `modificado: ` : `creado: `,
        content = `<strong>${atrib.name}</strong>
          </br>código SISA: ${atrib.cod_sisa}
          </br>tipo SISA: ${atrib.tipo_sisa}
          </br><a href='${osmUrl}changeset/${atrib.changeset}' target='_blank'>conjunto de cambios ${atrib.changeset}</a>
          </br>versión del objeto: ${atrib.version}
          </br>${fechaPrefix}</br>${atrib.timestamp}
          </br><a href='${osmUrl}${atrib.id}' target='_blank'>ver en OpenStreetMap</a>
          </br><a href='#14/${coordinates[1]}/${coordinates[0]}'>acercar</a>`;

      mapa.panTo(e.lngLat);

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
      cantidad = rels = vias = nodos = 0;
      data.features.forEach((f) => {
        let p = f.properties,
          a = p.amenity;
        if (a === "hospital" || a === "clinic" || a === "doctors") {
          cantidad++;
          if (p["@id"].includes("node")) {
            nodos++;
          }
          if (p["@id"].includes("way")) {
            vias++;
          }
          if (p["@id"].includes("relation")) {
            rels++;
          }
        }
      });
      updateCounts();
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

    lastLayer = capa + "-" + valorTxt[valor];
  });
});

function updateCounts() {
  let cantLabel = `${cantidad} objetos | ${nodos} nodos | ${vias} vías | ${rels} relaciones`, labelContainer = document.getElementById(activeInput).nextElementSibling;
  labelContainer.innerText = cantLabel;
}
