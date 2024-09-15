"use client";

import React, { useEffect } from "react";

import { Card, Divider } from "antd";
import { Chart } from "@antv/g2";
import { trpc } from "@/trpc/client";
import { helix } from "ldrs";
import { CommentOutlined } from "@ant-design/icons";
import Image from "next/image";

import placeholderImage from "@/app/public/images/corgi.png";

helix.register();

const GraphCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card
      title={title}
      className="flex-1 rounded-lg p-0 m-0"
      extra={<a href="#">Favorite</a>}
      styles={{ body: { padding: 0 } }}
    >
      <div>{children}</div>

      <Divider style={{ margin: 0 }} />

      <div className="flex justify-between items-center p-3">
        <Image
          width={32}
          height={32}
          src={placeholderImage}
          className="rounded-full"
          alt="Profile Img"
        />

        <div className="flex items-center">
          <span className="text-md text-neutral-400">3</span>
          <CommentOutlined
            className="ml-2"
            style={{ color: "#a3a3a3", fontSize: "18px" }}
          />
        </div>
      </div>
    </Card>
  );
};

export default function GraphSection() {
  const testingRet = trpc.medical.fetchCovidTestingData.useQuery({
    nWeeks: 20,
  });

  const bloodRet = trpc.medical.fetchBloodInfections.useQuery({ nWeeks: 12 });

  useEffect(() => {
    const setupCharts = async () => {
      if (!bloodRet.data || !testingRet.data) return;

      const bloodData = bloodRet.data.map((data) => ({
        disease: data.disease,
        time: `${data.month}.${data.year}`,
        value: data.value,
      }));
      const testingChart = new Chart({
        container: "testing-chart",
        autoFit: true,
      });

      const bloodInfectionsChart = new Chart({
        container: "blood-infections-chart",
        autoFit: true,
      });

      bloodInfectionsChart
        .data(bloodData)
        .encode("x", "time")
        .encode("y", "value")
        .encode("color", "disease")
        .axis("x", { title: false })
        .axis("y", { title: false });

      bloodInfectionsChart.area().style("fillOpacity", 0.3);
      bloodInfectionsChart.line().style("strokeWidth", 2).tooltip(false);
      bloodInfectionsChart.render();

      testingChart
        .interval()
        .data(testingRet.data)
        .encode("x", "month")
        .encode("y", "tests")
        .encode("color", "month");

      bloodInfectionsChart.render();
      testingChart.render();
    };

    if (!testingRet.data || !bloodRet.data) return;

    setupCharts();
  }, [testingRet, bloodRet]);

  if (!testingRet.data)
    return (
      <div className="flex justify-center items-center mt-10">
        <l-helix size="72" speed="2.5" color="black"></l-helix>
      </div>
    );
  return (
    <div className="flex flex-row justify-evenly items-center gap-3">
      <GraphCard title="Bloodborne Infections">
        <div id="blood-infections-chart" className="w-full"></div>
      </GraphCard>
      <GraphCard title="COVID-19 PCR Tests">
        <div id="testing-chart" className="w-full"></div>
      </GraphCard>
    </div>
  );
}
