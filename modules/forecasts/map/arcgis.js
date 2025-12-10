import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import { windMapSymbol, waveMapSymbol } from "../../utils/map/symbols.js";
import { mapLabelClasses } from "../../utils/map/labels.js";

export const addDataToMap = (data, type, title) => {
  const mapElement = document.getElementById("viewDiv")
  const graphics = data.map(obs => {
    return new Graphic({
      geometry: new Point({x: obs?.lon || 0, y: obs?.lat || 0, spatialReference: {wkid: 4326}}),
      attributes: {
        name: obs?.name || '',
        value: obs?.value || 0,
        caption: obs?.caption || '',
        rotation: obs?.rotation || 0,
        rating: obs?.rating || 0
      }
    }) 
  })
  
  const layer = createLayer(graphics, type, title)
  mapElement.map.add(layer);
  const layers = mapElement.map.allLayers.items
}

const createLayer = (graphics, type, title) => {
  const labelClasses = mapLabelClasses()
  const renderer = getRenderer(type);
  return new FeatureLayer({
          title: title || 'Forecast Data',
          geometryType: "point",
          labelingInfo: labelClasses,
          source: graphics,
          fields: [
             {
              name: "ObjectID",
              type: "oid",
            },
            {
              name: "name",
              type: "string",
            },
            {
              name: "value",
              type: "double",
            },
            {
              name: "caption",
              type: "string",
            },
            {
              name: "rotation",
              type: "double",
            },
            {
              name: "rating",
              type: "integer",
            }
          ],
          renderer: renderer,
  });
}

const getRenderer = (type) => {
  let maxValue = 10;
  let symbol = waveMapSymbol();
  
  if (type === 'wind') {
    maxValue = 20;
    symbol = windMapSymbol()
  }
  return {
    type: "simple",
    symbol: symbol,
    visualVariables: [
      {
        type: "color",
        field: "rating",
        stops: [
          { value: 0, color: "#9e9e9e" },
          { value: 1, color: "#F24A6D" },
          { value: 2, color: "#FD9504" },
          { value: 3, color: "#FFCD1F" },
          { value: 4, color: "#0FD674" },
          { value: 5, color: "#059271" },
          { value: 6, color: "#6951F5" },
          { value: 7, color: "#641EC6;" }
        ]
      },
      {
        type: "size",
        field: "value",
        minDataValue: 0,
        maxDataValue: maxValue, // Max speed expected in data
        minSize: "10px",
        maxSize: "60px" // Max symbol size on map
      },
      {
        type: "rotation",
        field: "rotation",
        rotationType: "geographic" // 0 is North, clockwise direction
      }
    ]
  }
}

