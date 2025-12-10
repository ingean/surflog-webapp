import CIMSymbol from "@arcgis/core/symbols/CIMSymbol.js"
import * as cimSymbolUtils from "@arcgis/core/symbols/support/cimSymbolUtils.js";

export const windMapSymbol = () => {
  let symbol = new CIMSymbol({
    "data": {
      "type": "CIMSymbolReference",
      "symbol": {
        "type": "CIMPointSymbol",
        "symbolLayers": [
          {
            "type": "CIMVectorMarker",
            "enable": true,
            "anchorPoint": {
              "x": 0.5,
              "y": 0,
              "z": 0
            },
            "anchorPointUnits": "Relative",
            "dominantSizeAxis3D": "Y",
            "size": 14,
            "billboardMode3D": "FaceNearPlane",
            "frame": {
              "xmin": 0,
              "ymin": 0,
              "xmax": 17,
              "ymax": 17
            },
            "markerGraphics": [
              {
                "type": "CIMMarkerGraphic",
                "geometry": {
                  "rings": [
                    [
                      [
                        17,
                        8.5
                      ],
                      [
                        11.11,
                        11.9
                      ],
                      [
                        11.11,
                        9.35
                      ],
                      [
                        0,
                        9.35
                      ],
                      [
                        0,
                        7.65
                      ],
                      [
                        11.11,
                        7.65
                      ],
                      [
                        11.11,
                        5.1
                      ],
                      [
                        17,
                        8.5
                      ]
                    ]
                  ]
                },
                "symbol": {
                  "type": "CIMPolygonSymbol",
                  "symbolLayers": [
                    {
                      "type": "CIMSolidStroke",
                      "enable": true,
                      "capStyle": "Round",
                      "joinStyle": "Round",
                      "lineStyle3D": "Strip",
                      "miterLimit": 10,
                      "width": 0,
                      "height3D": 1,
                      "anchor3D": "Center",
                      "color": [
                        51,
                        51,
                        51,
                        255
                      ]
                    },
                    {
                      "type": "CIMSolidFill",
                      "enable": true,
                      "color": [
                        51,
                        51,
                        51,
                        255
                      ]
                    }
                  ],
                  "angleAlignment": "Map"
                }
              }
            ],
            "scaleSymbolsProportionally": true,
            "respectFrame": true,
            "clippingPath": {
              "type": "CIMClippingPath",
              "clippingType": "Intersect",
              "path": {
                "rings": [
                  [
                    [
                      0,
                      0
                    ],
                    [
                      17,
                      0
                    ],
                    [
                      17,
                      17
                    ],
                    [
                      0,
                      17
                    ],
                    [
                      0,
                      0
                    ]
                  ]
                ]
              }
            }
          }
        ],
        "haloSize": 1,
        "scaleX": 1,
        "angleAlignment": "Display"
      }
    }
  });
  cimSymbolUtils.applyCIMSymbolRotation(symbol, 90, true);
  return symbol
}

export const waveMapSymbol = () => {
  let symbol = new CIMSymbol({
    "data": {
      "type": "CIMSymbolReference",
      "symbol": {
        "type": "CIMPointSymbol",
        "symbolLayers": [
          {
            "type": "CIMVectorMarker",
            "enable": true,
            "anchorPoint": {
              "x": -0.000004904477669862195,
              "y": 0.000013335704125173227
            },
            "anchorPointUnits": "Relative",
            "dominantSizeAxis3D": "Y",
            "size": 14,
            "billboardMode3D": "FaceNearPlane",
            "frame": {
              "xmin": 0,
              "ymin": 0,
              "xmax": 17,
              "ymax": 17
            },
            "markerGraphics": [
              {
                "type": "CIMMarkerGraphic",
                "geometry": {
                  "rings": [
                    [
                      [
                        11.62,
                        7.89
                      ],
                      [
                        11.62,
                        11.62
                      ],
                      [
                        13.85,
                        11.62
                      ],
                      [
                        13.85,
                        11.77
                      ],
                      [
                        12.45,
                        12.42
                      ],
                      [
                        11.19,
                        13.29
                      ],
                      [
                        10.08,
                        14.37
                      ],
                      [
                        9.18,
                        15.62
                      ],
                      [
                        8.5,
                        17
                      ],
                      [
                        7.97,
                        15.83
                      ],
                      [
                        7.27,
                        14.74
                      ],
                      [
                        6.42,
                        13.78
                      ],
                      [
                        5.43,
                        12.95
                      ],
                      [
                        4.34,
                        12.27
                      ],
                      [
                        3.15,
                        11.77
                      ],
                      [
                        3.15,
                        11.62
                      ],
                      [
                        5.4,
                        11.62
                      ],
                      [
                        5.4,
                        7.89
                      ],
                      [
                        11.62,
                        7.89
                      ]
                    ],
                    [
                      [
                        11.62,
                        5.81
                      ],
                      [
                        11.62,
                        7.38
                      ],
                      [
                        5.4,
                        7.38
                      ],
                      [
                        5.4,
                        5.81
                      ],
                      [
                        11.62,
                        5.81
                      ]
                    ],
                    [
                      [
                        11.62,
                        3.91
                      ],
                      [
                        11.62,
                        5
                      ],
                      [
                        5.4,
                        5
                      ],
                      [
                        5.4,
                        3.91
                      ],
                      [
                        11.62,
                        3.91
                      ]
                    ],
                    [
                      [
                        11.62,
                        2
                      ],
                      [
                        11.62,
                        2.67
                      ],
                      [
                        5.4,
                        2.67
                      ],
                      [
                        5.4,
                        2
                      ],
                      [
                        11.62,
                        2
                      ]
                    ],
                    [
                      [
                        11.62,
                        0
                      ],
                      [
                        11.62,
                        0.46
                      ],
                      [
                        5.4,
                        0.46
                      ],
                      [
                        5.4,
                        0
                      ],
                      [
                        11.62,
                        0
                      ]
                    ]
                  ]
                },
                "symbol": {
                  "type": "CIMPolygonSymbol",
                  "symbolLayers": [
                    {
                      "type": "CIMSolidFill",
                      "enable": true,
                      "color": [
                        0,
                        0,
                        0,
                        255
                      ]
                    }
                  ]
                }
              }
            ],
            "scaleSymbolsProportionally": true,
            "respectFrame": true,
            "clippingPath": {
              "type": "CIMClippingPath",
              "clippingType": "Intersect",
              "path": {
                "rings": [
                  [
                    [
                      0,
                      0
                    ],
                    [
                      17,
                      0
                    ],
                    [
                      17,
                      17
                    ],
                    [
                      0,
                      17
                    ],
                    [
                      0,
                      0
                    ]
                  ]
                ]
              }
            }
          }
        ],
        "haloSize": 1,
        "scaleX": 1,
        "angleAlignment": "Display"
      }
    }
  });
  cimSymbolUtils.applyCIMSymbolRotation(symbol, 180, true);
  return symbol
}