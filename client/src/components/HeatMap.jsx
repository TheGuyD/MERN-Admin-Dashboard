import { ResponsiveHeatMap } from "@nivo/heatmap";

function generateTimeKeys(startingAt, endingAt, interval) {
  const keysArray = [];
  const start = new Date(`1970-01-01T${startingAt}:00`);
  const end = new Date(`1970-01-01T${endingAt}:00`);

  let currentTime = start;

  while (currentTime <= end) {
    // Format the time as HH:MM
    const formattedTime = currentTime.toTimeString().slice(0, 5);
    keysArray.push(formattedTime);

    // Increment time by the interval (in minutes)
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return keysArray;
}

const colors = {
  occupied: "#660000",
  unoccupied: "green",
};
const StylizedCell = ({
  x,
  y,
  width,
  height,
  color,
  opacity,
  borderWidth,
  borderColor,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#000", stopOpacity: 0.3 }} />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
    <rect
      width={width}
      height={height}
      rx={10}
      ry={10}
      fill="url(#gradient)"
      filter="url(#shadow)"
      strokeWidth={borderWidth}
      stroke={borderColor}
      opacity={opacity}
    />
  </g>
);

const HeatMap = (nivoData, startingAt, endingAt, interval) => (
  <ResponsiveHeatMap
    data={nivoData}
    keys={generateTimeKeys(startingAt, endingAt, interval)}
    indexBy="parkingSlot"
    margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
    forceSquare={true}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Time Intervals",
      legendPosition: "middle",
      legendOffset: 36,
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Parking Slots",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    xInnerPadding={0.25}
    yInnerPadding={0.25}
    cellComponent="circle"
    cellShape={StylizedCell} // Use the stylized custom cell
    cellOpacity={1}
    cellBorderWidth={1}
    cellBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
    labelTextColor={{ from: "color", modifiers: [["brighter", 1.8]] }}
    colors={(d) => colors[d.value] || "#ffffff"} // Custom color function
    emptyColor="#555555"
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        translateX: 120,
        itemWidth: 100,
        itemHeight: 20,
        itemsSpacing: 2,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    theme={{
      labels: {
        text: {
          fontWeight: "bold", // Make labels bold
        },
      },
      axis: {
        ticks: {
          text: {
            fontWeight: "bold", // Make axis labels bold
          },
        },
      },
    }}
  />
);

export default HeatMap;
