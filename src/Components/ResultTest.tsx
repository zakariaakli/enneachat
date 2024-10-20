import React, {useContext} from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {DataContext} from "../Helpers/dataContext"
import { ResultData } from "../Models/EnneagramResult";

// Register the necessary components for the Radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);



const RadarChart: React.FC<ResultData | null> = (data) => {

  const RadarOptions = {
    scales: {
      r: {
        ticks: {
          min: 0,
          max: 20,
          stepSize: 5,
          backdropColor: 'rgba(255, 255, 255, 0.75)', // Updated for newer version
        },
        angleLines: {
          color: '#ebedef',
          lineWidth: 1,
        },
        grid: {
          color: '#ebedef', // Use 'grid' instead of 'gridLines' in the new version
          circular: true,
        },
      },
    },
  };

  const RadarData = {
    labels: [data?.enneagramType1, data?.enneagramType2, data?.enneagramType3],
    datasets: [
      {
        label: "March",
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 202, 236, 1)",
        data: [data?.enneagramType1, data?.enneagramType2, data?.enneagramType3],
      },
    ],
  };

  const DefaultRadarData = {
    labels: ["Perfectionnist", "Helper", "Achiever"],
    datasets: [
      {
        label: "March",
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 202, 236, 1)",
        data: [5, 8, 4],
      },
    ],
  };


  return (
    <div>

      {data ?
      <>
  <h2>Specific Enneagram result for : {data.UserName}</h2>
      <Radar data={RadarData} options={RadarOptions} />
      </>

:
<>
<h2>Average people assessment shows the following results. Continue your assessment to have your specific Enneagram Type</h2>
<Radar data={DefaultRadarData} options={RadarOptions} />
</>

    }
    </div>
  );
};

export default RadarChart;
