import { Circle as CircleStyle, Fill, Stroke, Style, Text} from '../../lib/ol/style.js'

const styles = {
  '10': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
    text: new Text({
      text: 'Buoy',
      font: 'Normal 12/1 Arial',
      offsetY: -15,
      fill: new Fill({color: '#aa3300'}),
      stroke: new Stroke({color: '#ffffff', width: 1})
    })
  }),
  '20': new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
  }),
};

const textSymbol = (feature) => {
  return new Text({
    text: feature.get('name'),
    font: 'Bold 12/1 Arial',
    offsetY: -15,
    fill: new Fill({color: '#aa3300'}),
    stroke: new Stroke({color: '#ffffff', width: 2})
  })
}

export const pointStyle = (feature) => {
  return new Style({
    image: new CircleStyle({
      radius: feature.get('size') / 2,
      fill: new Fill({color: '#666666'}),
      stroke: new Stroke({color: '#bada55', width: 1}),
    }),
    text: textSymbol(feature)
  })
}