import { Circle as CircleStyle, Fill, Stroke, Style, Text} from '../../lib/ol/style.js'

const ratingColor = {
  0: '#9e9e9e',
  1: '#E1576F',
  2: '#F19A37',
  3: '#F7CF4C',
  4: '#62D37E',
  5: '#409173',
  6: '#6452EB',
  7: '#5C23C0'
}


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
  let font = (feature.get('size') === 4) ? 'Bold 10/1 Arial' : 'Bold 14/1 Arial'
  return new Text({
    text: feature.get('name'),
    font,
    offsetY: -20,
    fill: new Fill({color: '#000000'}),
    stroke: new Stroke({color: '#ffffff', width: 2})
  })
}

export const pointStyle = (feature) => {
  return new Style({
    image: new CircleStyle({
      radius: feature.get('size'),
      fill: new Fill({color: ratingColor[feature.get('rating')]}),
      stroke: new Stroke({color: '#ffffff', width: 2}),
    }),
    text: textSymbol(feature)
  })
}