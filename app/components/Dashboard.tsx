import React from "react";
import { Button, Tooltip } from "antd";
import {
  DownloadOutlined,
  AlignLeftOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import GraphSection from "./GraphSection";

export default function Dashboard() {
  const Header = () => {
    return (
      <div className="flex flex-row justify-between items-center py-3">
        <h2 className="text-xl">Dashboard</h2>

        <div className="flex gap-1">
          <Button
            type="default"
            icon={
              <DownloadOutlined
                style={{ color: "var(--primary)", fontSize: "18px" }}
              />
            }
            iconPosition="end"
          >
            Export to PDF
          </Button>
          <Tooltip title="Export to PDF" />

          <Button
            type="default"
            icon={
              <AlignLeftOutlined
                style={{ color: "var(--primary)", fontSize: "18px" }}
              />
            }
            iconPosition="end"
          >
            <span className="text-gray-400">(3)</span>
            Notes
          </Button>
          <Tooltip title="Notes" />

          <Button
            type="default"
            icon={
              <FilterOutlined
                style={{
                  color: "var(--primary)",
                  fontSize: "18px",
                }}
              />
            }
            iconPosition="end"
          >
            <span className="bg-primary w-6 h-6 flex items-center justify-center rounded-full font-semibold font-sm text-white">
              9+
            </span>
            Filter
          </Button>
          <Tooltip title="Filter" />
        </div>
      </div>
    );
  };

  return (
    <section className="shadow-inner py-5 px-24">
      <Header />
      <GraphSection />
    </section>
  );
}
