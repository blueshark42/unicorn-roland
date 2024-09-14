"use client";
import React, { useEffect } from "react";
import { Card } from "antd";
import { Chart } from "@antv/g2";

const GraphCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card title={title} className="flex-1 rounded-lg">
      <div>{children}</div>
    </Card>
  );
};

export default function GraphSection() {
  useEffect(() => {
    const setupCharts = () => {
      const testingData = [
        { genre: "Sports", sold: 275 },
        { genre: "Strategy", sold: 115 },
        { genre: "Action", sold: 120 },
        { genre: "Shooter", sold: 350 },
        { genre: "Other", sold: 150 },
      ];

      const bloodInfectionsData = [
        {
          type: "E-Coli",
          amount: 532,
        },
        {
          type: "Influenza",
          amount: 1293,
        },
        {
          type: "Ebola",
          amount: 82,
        },
      ];

      const testingChart = new Chart({
        container: "testing-chart",
        autoFit: true,
      });

      const bloodInfectionsChart = new Chart({
        container: "blood-infections-chart",
        autoFit: true,
      });

      bloodInfectionsChart
        .interval()
        .data(bloodInfectionsData)
        .encode("x", "type")
        .encode("y", "amount");

      testingChart
        .interval()
        .data(testingData)
        .encode("x", "genre")
        .encode("y", "sold")
        .encode("color", "genre");

      bloodInfectionsChart.render();
      testingChart.render();
    };

    setupCharts();
  }, []);

  return (
    <div className="flex flex-row justify-evenly items-center gap-3">
      <GraphCard title="Chart 1">
        <div id="blood-infections-chart" className="w-full"></div>
      </GraphCard>
      <GraphCard title="Chart 2">
        <div id="testing-chart" className="w-full"></div>
      </GraphCard>
    </div>
  );
}
