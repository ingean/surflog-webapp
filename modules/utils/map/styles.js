import { Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape} from '../../lib/ol/style.js'

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

const shaft = new RegularShape({
  points: 2,
  radius: 5,
  stroke: new Stroke({
    width: 2,
    color: 'black',
  }),
  rotateWithView: true,
});

const head = new RegularShape({
  points: 3,
  radius: 5,
  fill: new Fill({
    color: 'black',
  }),
  rotateWithView: true,
});

const arrowStyles = [new Style({image: shaft}), new Style({image: head})];

const textSymbol = (feature) => {
  let font = (feature.get('size') === 4 || feature.get('value')) ? '8px sans-serif' : '11px sans-serif'
  let text = feature.get('value') || feature.get('name')
  let offsetY = feature.get('value') ? 0 : (feature.get('size') === 4) ?  -10 : -20
  let fillColor = feature.get('value') ? '#ffffff' : '#000000'
  let stroke = feature.get('value') ? null : new Stroke({color: '#ffffff', width: 2})
  
  return new Text({
    text,
    font,
    offsetY,
    fill: new Fill({color: fillColor}),
    stroke
  })
}

const valueStyle = (feature) => {
  let angle = feature.get('rotation')
  const scale = 1;
  shaft.setScale([1, scale]);
  shaft.setRotation(angle);
  head.setDisplacement([
    0,
    head.getRadius() / 2 + shaft.getRadius() * scale,
  ])
  head.setRotation(angle);

  let markerStyle = new Style({
    image: new CircleStyle({
      radius: 12,
      fill: new Fill({color: '#000000'}),
    }),
    text: textSymbol(feature)
  })

  return [markerStyle, ...arrowStyles]
}

const circleStyle = (feature) => {
  return new Style({
    image: new CircleStyle({
      radius: feature.get('size'),
      fill: new Fill({color: ratingColor[feature.get('rating')]}),
      stroke: new Stroke({color: '#ffffff', width: 1}),
    }),
    text: textSymbol(feature)
  })
}

export const pointStyle = (feature) => {
  return feature.get('value') ? valueStyle(feature) : circleStyle(feature)
}