import Chart from "react-apexcharts";
import { useContext } from "react";
import { GlobalContext } from "../../context";

// --- utility ----------------------------------------------------------
function makeColors(n) {
  // evenly spaced hues → distinct colours
  return Array.from({ length: n }, (_, i) =>
    `hsl(${Math.round((360 / n) * i)}, 70%, 60%)`
  );
}

// ----------------------------------------------------------------------
export default function TransactionChartSummary() {
  const { allTransactions } = useContext(GlobalContext);

  /* ---- separate income & expenses ---------------------------------- */
  const incomeTotal = allTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenseTxns = allTransactions.filter(t => t.type === "expense");

  /* ---- build chart arrays ------------------------------------------ */
  const labels = [
    "Income",
    ...expenseTxns.map(t => t.description?.trim() || "Unnamed"),
  ];
  const series = [
    incomeTotal,
    ...expenseTxns.map(t => parseFloat(t.amount)),
  ];
  const colours = ["#1A73E8", ...makeColors(expenseTxns.length)];

  /* ---- apex options ------------------------------------------------- */
  const options = {
    labels,
    colors: colours,
    chart: { type: "pie", animations: { enabled: true, speed: 700 } },
    legend: { show: true, position: "bottom" },
    dataLabels: { enabled: true },
    tooltip: { enabled: true, theme: "dark" },
  };

  /* ---- empty‑state guard ------------------------------------------- */
  if (series.every(v => v === 0)) {
    return <p>No transactions to display yet.</p>;
  }

  /* ---- render ------------------------------------------------------- */
  return (
    <Chart
      options={options}
      series={series}
      type="pie"          /* 👈 pie chart */
      width="300px"
      height="300px"
    />
  );
}
