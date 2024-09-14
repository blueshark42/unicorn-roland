import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

import GraphSection from "./GraphSection";

export default function Dashboard() {
  const Header = () => {
    return (
      <div className="flex flex-row justify-between items-center py-3">
        <h2 className="text-xl">Dashboard</h2>

        <div className="flex gap-1">
          <Button type="default" icon={<SearchOutlined />} iconPosition="end">
            Export to PDF
          </Button>
          <Tooltip title="Export to PDF" />

          <Button type="default" icon={<SearchOutlined />} iconPosition="end">
            <span className="text-gray-400">(3)</span>
            Notes
          </Button>
          <Tooltip title="Notes" />

          <Button type="default" icon={<SearchOutlined />} iconPosition="end">
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
