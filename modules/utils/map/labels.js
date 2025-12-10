const ratingLabels = [
  { rating: 0, textColor: "#9e9e9e" },
  { rating: 1, textColor: "#F24A6D" },
  { rating: 2, textColor: "#FD9504" },
  { rating: 3, textColor: "#FFCD1F" },
  { rating: 4, textColor: "#0FD674" },
  { rating: 5, textColor: "#059271" },
  { rating: 6, textColor: "#6951F5" },
  { rating: 7, textColor: "#641EC6" },
];

export const mapLabelClasses = () => {
  return ratingLabels.map(lc => mapLabelClass(lc.textColor, lc.rating));
}

const mapLabelClass = (textColor, rating) => {
  return {
    symbol: {
      type: "text", // autocasts as new TextSymbol()
      color: textColor,
      haloColor: "white",
      haloSize: 2,
      font: {
        // autocast as new Font()
        family: "Noto Sans",
        size: 8,
      },
    },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.name + '(' + $feature.caption + ')'",
    },
    maxScale: 0,
    minScale: 5000000,
    where: `rating = ${rating}`
  };
}