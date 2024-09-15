"use client";
import React, { useEffect } from "react";
import { Card } from "antd";
import { Chart } from "@antv/g2";
import { trpc } from "@/trpc/client";

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
    const setupCharts = async () => {
      const testingData = [
        { genre: "Sports", sold: 275 },
        { genre: "Strategy", sold: 115 },
        { genre: "Action", sold: 120 },
        { genre: "Shooter", sold: 350 },
        { genre: "Other", sold: 150 },
      ];

      const bloodInfectionsData = [
        { country: "Asia", year: "1750", value: 502 },
        { country: "Asia", year: "1800", value: 635 },
        { country: "Asia", year: "1850", value: 809 },
        { country: "Asia", year: "1900", value: 5268 },
        { country: "Asia", year: "1950", value: 4400 },
        { country: "Asia", year: "1999", value: 3634 },
        { country: "Asia", year: "2050", value: 947 },
        { country: "Africa", year: "1750", value: 106 },
        { country: "Africa", year: "1800", value: 107 },
        { country: "Africa", year: "1850", value: 111 },
        { country: "Africa", year: "1900", value: 1766 },
        { country: "Africa", year: "1950", value: 221 },
        { country: "Africa", year: "1999", value: 767 },
        { country: "Africa", year: "2050", value: 133 },
        { country: "Europe", year: "1750", value: 163 },
        { country: "Europe", year: "1800", value: 203 },
        { country: "Europe", year: "1850", value: 276 },
        { country: "Europe", year: "1900", value: 628 },
        { country: "Europe", year: "1950", value: 547 },
        { country: "Europe", year: "1999", value: 729 },
        { country: "Europe", year: "2050", value: 408 },
        { country: "Oceania", year: "1750", value: 200 },
        { country: "Oceania", year: "1800", value: 200 },
        { country: "Oceania", year: "1850", value: 200 },
        { country: "Oceania", year: "1900", value: 460 },
        { country: "Oceania", year: "1950", value: 230 },
        { country: "Oceania", year: "1999", value: 300 },
        { country: "Oceania", year: "2050", value: 300 },
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
        .data(bloodInfectionsData)
        .encode("x", "year")
        .encode("y", "value")
        .encode("color", "country")
        .axis("x", { title: false })
        .axis("y", { title: false });

      bloodInfectionsChart.area().style("fillOpacity", 0.3);
      bloodInfectionsChart.line().style("strokeWidth", 2).tooltip(false);
      bloodInfectionsChart.render();

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

  const greeting = trpc.hello.useQuery({ text: "hello" });
  console.log(greeting);

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
