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
  }
}

function cleanMap(capa, valor) {
  //console.log(lastLayer + ' ' + capa + '-' + valorTxt[valor])
  if (lastLayer != '' && lastLayer != capa + '-' + valorTxt[valor]) {
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
      
      lastLayer = capa + '-' + valorTxt[valor];
  });
});
