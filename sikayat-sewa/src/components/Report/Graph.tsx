import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDataStore } from "../../store/store";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4C4C",
  "#4CFFDA",
  "#A28BFE",
  "#FEA28B",
  "#4CAF50",
  "#D32F2F",
  "#F06292",
  "#9575CD",
  "#4DB6AC",
  "#BA68C8",
];

export default function WardAnalytics() {
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const BarGraphData = useDataStore((state) => state.BarGraphData);

  const barData = BarGraphData.map(({ ward, totalProblems }) => ({
    ward,
    totalProblems,
  }));

  const selectedCategories =
    BarGraphData.find((item) => item.ward === selectedWard)?.categories || [];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Ward Analytics</h2>

      {/* Dropdown */}
      <div className="mb-6">
        <label htmlFor="ward" className="font-semibold mr-2">
          Select Ward:
        </label>
        <select
          id="ward"
          className="px-3 py-2 border rounded"
          value={selectedWard ?? ""}
          onChange={(e) =>
            setSelectedWard(e.target.value === "" ? null : e.target.value)
          }
        >
          <option value="">All Wards</option>
          {BarGraphData.map(({ ward }) => (
            <option key={ward} value={ward}>
              Ward {ward}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          onClick={(e: any) => setSelectedWard(e?.activeLabel || null)}
        >
          <XAxis dataKey="ward"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalProblems" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Donut Chart */}
      {selectedWard && (
        <>
          <h3 className="text-xl font-semibold mt-8 mb-4">
            Problem Categories in Ward {selectedWard}
          </h3>

          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={selectedCategories}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                label={({ category }) =>
                  category.length > 12
                    ? category.slice(0, 12) + "..."
                    : category
                }
                labelLine={false}
              >
                {selectedCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.category}`}
                    name={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="top"
                align="center"
                wrapperStyle={{ maxHeight: 90, overflow: "auto" }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
