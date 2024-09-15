"use client";

import React, { useEffect, useState } from "react";

import { Card, Divider, Button } from "antd";
import { Chart } from "@antv/g2";
import { trpc } from "@/trpc/client";
import { CommentOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";

import placeholderImage from "@/app/public/images/corgi.png";

const GraphCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const ExtraSection = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    const mutation = trpc.favorite.useMutation();

    const handleFavorite = () => {
      mutation.mutate(title);
      setIsFavorite((prev) => !prev);
    };

    return (
      <Button
        type="text"
        onClick={handleFavorite}
        icon={
          isFavorite ? (
            <StarFilled style={{ color: "#a3a3a3", fontSize: "18px" }} />
          ) : (
            <StarOutlined style={{ color: "#a3a3a3", fontSize: "18px" }} />
          )
        }
      ></Button>
    );
  };

  return (
    <Card
      title={title}
      className="flex-1 rounded-lg p-0 m-0"
      extra={<ExtraSection />}
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
          <Button
            type="text"
            icon={
              <CommentOutlined
                className="ml-2"
                style={{ color: "#a3a3a3", fontSize: "18px" }}
              />
            }
            iconPosition="end"
          >
            <span className="text-md text-neutral-400">3</span>
          </Button>
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

    setupCharts();
  }, [testingRet.data, bloodRet.data]);

  if (!testingRet.data || !bloodRet.data) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader />
      </div>
    );
  }

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

  function Loader() {
    useEffect(() => {
      async function getLoader() {
        const { helix } = await import("ldrs");
        helix.register();
      }
      getLoader();
    }, []);
    return <l-helix size="72" speed="2.5" color="black"></l-helix>;
  }
}
