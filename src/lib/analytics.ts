import { openDB } from "idb";
import { subDays, format } from "date-fns";

interface SalesData {
  date: Date;
  quantity: number;
  itemId: string;
}

export class InventoryAnalytics {
  // Calculate predicted stock needs based on historical sales
  static async predictStockNeeds(
    itemId: string,
    daysToAnalyze = 30
  ): Promise<{
    averageDailySales: number;
    predictedWeeklyNeed: number;
    recommendedReorderPoint: number;
    stockoutRisk: "Low" | "Medium" | "High";
  }> {
    const db = await openDB("inventory-system", 1);
    const endDate = new Date();
    const startDate = subDays(endDate, daysToAnalyze);

    // Get historical sales data
    const sales = await db.getAllFromIndex("transactions", "by-date");
    const itemSales = sales.filter(
      (sale) =>
        sale.itemId === itemId &&
        sale.type === "out" &&
        new Date(sale.timestamp) >= startDate
    );

    // Calculate daily sales statistics
    const dailySales = this.aggregateDailySales(itemSales);
    const averageDailySales = this.calculateAverageDailySales(dailySales);
    const salesVariability = this.calculateSalesVariability(
      dailySales,
      averageDailySales
    );

    // Calculate predictions
    const predictedWeeklyNeed = averageDailySales * 7;
    const recommendedReorderPoint = Math.ceil(
      averageDailySales * 7 + salesVariability * Math.sqrt(7)
    );

    // Determine stockout risk
    const stockoutRisk = this.calculateStockoutRisk(
      salesVariability,
      averageDailySales
    );

    return {
      averageDailySales,
      predictedWeeklyNeed,
      recommendedReorderPoint,
      stockoutRisk,
    };
  }

  // Analyze seasonal trends
  static async analyzeSeasonalTrends(itemId: string, monthsToAnalyze = 12) {
    const db = await openDB("inventory-system", 1);
    const endDate = new Date();
    const startDate = new Date(
      endDate.setMonth(endDate.getMonth() - monthsToAnalyze)
    );

    const sales = await db.getAllFromIndex("transactions", "by-date");
    const itemSales = sales.filter(
      (sale) =>
        sale.itemId === itemId &&
        sale.type === "out" &&
        new Date(sale.timestamp) >= startDate
    );

    // Group sales by month
    const monthlySales = itemSales.reduce((acc, sale) => {
      const month = format(new Date(sale.timestamp), "yyyy-MM");
      acc[month] = (acc[month] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);

    return monthlySales;
  }

  private static aggregateDailySales(
    sales: SalesData[]
  ): Record<string, number> {
    return sales.reduce((acc, sale) => {
      const date = format(new Date(sale.date), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);
  }

  private static calculateAverageDailySales(
    dailySales: Record<string, number>
  ): number {
    const values = Object.values(dailySales);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private static calculateSalesVariability(
    dailySales: Record<string, number>,
    average: number
  ): number {
    const values = Object.values(dailySales);
    const squaredDiffs = values.map((value) => Math.pow(value - average, 2));
    return Math.sqrt(
      squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
    );
  }

  private static calculateStockoutRisk(
    variability: number,
    averageDailySales: number
  ): "Low" | "Medium" | "High" {
    const coefficientOfVariation = variability / averageDailySales;
    if (coefficientOfVariation < 0.5) return "Low";
    if (coefficientOfVariation < 1) return "Medium";
    return "High";
  }
}
