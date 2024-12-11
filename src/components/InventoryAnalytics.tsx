import React, { useEffect, useState } from "react";
import { InventoryAnalytics } from "../lib/analytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsProps {
  itemId: string;
}

export function InventoryAnalytic({ itemId }: AnalyticsProps) {
  const [predictions, setPredictions] = useState<any>(null);
  const [seasonalTrends, setSeasonalTrends] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [itemId]);

  async function loadAnalytics() {
    const stockPredictions = await InventoryAnalytics.predictStockNeeds(itemId);
    const trends = await InventoryAnalytics.analyzeSeasonalTrends(itemId);

    setPredictions(stockPredictions);
    setSeasonalTrends(trends);
  }

  if (!predictions || !seasonalTrends) {
    return <div>Loading analytics...</div>;
  }

  const trendData = Object.entries(seasonalTrends).map(([month, quantity]) => ({
    month,
    quantity,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Stock Predictions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Average Daily Sales</p>
            <p className="text-xl font-medium">
              {predictions.averageDailySales.toFixed(2)} units
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Predicted Weekly Need</p>
            <p className="text-xl font-medium">
              {predictions.predictedWeeklyNeed.toFixed(2)} units
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Recommended Reorder Point</p>
            <p className="text-xl font-medium">
              {predictions.recommendedReorderPoint} units
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stockout Risk</p>
            <p
              className={`text-xl font-medium ${
                predictions.stockoutRisk === "High"
                  ? "text-red-600"
                  : predictions.stockoutRisk === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {predictions.stockoutRisk}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Seasonal Trends</h3>
        <LineChart width={600} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#8884d8"
            name="Sales Volume"
          />
        </LineChart>
      </div>
    </div>
  );
}
