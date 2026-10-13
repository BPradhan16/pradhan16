"use strict";

const STORAGE_KEY = "pradhan16_trades";
let plChart = null;

// ---------- Common Helpers ----------

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);
  if (element) element.textContent = value;
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "—";

  return "₹" + value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getTrades() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Trade data error:", error);
    return [];
  }
}

function saveTrades(trades) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    return true;
  } catch (error) {
    console.error("Unable to save trades:", error);
    setText(
      "tradeMessage",
      "Could not save data. Check browser storage and available space."
    );
    return false;
  }
}

function showMessage(id, message, type = "") {
  const element = getElement(id);
  if (!element) return;

  element.textContent = message;
  element.classList.remove("positive", "negative");

  if (type) element.classList.add(type);
}

// ---------- Profit/Loss ----------

// Buy: (exit - entry) × quantity
// Sell: (entry - exit) × quantity
// This does not include brokerage, taxes, slippage or other charges.

function calculateTradePL(trade) {
  const entry = Number(trade.entry);
  const exit = Number(trade.exit);
  const quantity = Number(trade.quantity);
  const side = String(trade.side || "Buy").toLowerCase();

  if (
    !Number.isFinite(entry) ||
    !Number.isFinite(exit) ||
    !Number.isFinite(quantity) ||
    entry <= 0 ||
    exit <= 0 ||
    quantity <= 0
  ) {
    return 0;
  }

  if (side === "sell") {
    return (entry - exit) * quantity;
  }

  return (exit - entry) * quantity;
}

// ---------- Save a Trade ----------

function saveTrade(event) {
  if (event) event.preventDefault();

  const symbol = getElement("symbol").value.trim().toUpperCase();
  const side = getElement("side").value;
  const entry = Number(getElement("entry").value);
  const exit = Number(getElement("exit").value);
  const stopLoss = Number(getElement("tradeStopLoss").value);
  const target = Number(getElement("tradeTarget").value);
  const quantity = Number(getElement("quantity").value);

  if (!symbol) {
    showMessage("tradeMessage", "Enter the trading symbol.");
    return;
  }

  if (
    !Number.isFinite(entry) ||
    !Number.isFinite(exit) ||
    !Number.isFinite(stopLoss) ||
    !Number.isFinite(target) ||
    !Number.isFinite(quantity) ||
    entry <= 0 ||
    exit <= 0 ||
    stopLoss <= 0 ||
    target <= 0 ||
    quantity <= 0
  ) {
    showMessage("tradeMessage", "Enter valid positive numbers in all fields.");
    return;
  }

  const validBuy =
    side === "Buy" && stopLoss < entry && target > entry;

  const validSell =
    side === "Sell" && stopLoss > entry && target < entry;

  if (!validBuy && !validSell) {
    showMessage(
      "tradeMessage",
      "Check your Stop-loss and Target. Buy: SL below entry, target above entry. Sell: SL above entry, target below entry."
    );
    return;
  }

  const trade = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    symbol,
    side,
    entry,
    exit,
    stopLoss,
    target,
    quantity,
    date: new Date().toISOString()
  };

  trade.profitLoss = calculateTradePL(trade);

  const trades = getTrades();
  trades.push(trade);

  if (!saveTrades(trades)) return;

  getElement("tradeForm").reset();

  showMessage(
    "tradeMessage",
    "Trade saved. Calculated P/L: " + formatMoney(trade.profitLoss),
    trade.profitLoss >= 0 ? "positive" : "negative"
  );

  refreshDashboard();
}

// ---------- Dashboard Statistics ----------

function calculateStatistics() {
  const trades = getTrades();

  const results = trades.map(trade => ({
    ...trade,
    profitLoss: calculateTradePL(trade)
  }));

  const totalTrades = results.length;
  const winners = results.filter(t => t.profitLoss > 0).length;
  const losers = results.filter(t => t.profitLoss < 0).length;
  const totalPL = results.reduce((sum, t) => sum + t.profitLoss, 0);

  const winRate = totalTrades > 0
    ? (winners / totalTrades) * 100
    : 0;

  setText("totalTrades", String(totalTrades));
  setText("winningTrades", String(winners));
  setText("winRate", winRate.toFixed(1) + "%");

  const totalPLElement = getElement("totalPL");
  if (totalPLElement) {
    totalPLElement.textContent = formatMoney(totalPL);
    totalPLElement.classList.remove("positive", "negative");

    if (totalPL > 0) totalPLElement.classList.add("positive");
    if (totalPL < 0) totalPLElement.classList.add("negative");
  }
}

// ---------- Day 25: Risk Metrics ----------

function calculateRiskMetrics() {
  const trades = getTrades();

  const measured = trades.map(trade => {
    const entry = Number(trade.entry);
    const stopLoss = Number(trade.stopLoss ?? trade.sl);
    const target = Number(trade.target);
    const quantity = Number(trade.quantity ?? trade.qty);
    const side = String(trade.side || "Buy").toLowerCase();

    if (
      !Number.isFinite(entry) ||
      !Number.isFinite(stopLoss) ||
      !Number.isFinite(target) ||
      !Number.isFinite(quantity) ||
      entry <= 0 ||
      stopLoss <= 0 ||
      target <= 0 ||
      quantity <= 0
    ) {
      return null;
    }

    const validBuy =
      side === "buy" && stopLoss < entry && target > entry;

    const validSell =
      side === "sell" && stopLoss > entry && target < entry;

    if (!validBuy && !validSell) return null;

    const risk = Math.abs(entry - stopLoss) * quantity;
    const reward = Math.abs(target - entry) * quantity;

    if (risk <= 0) return null;

    return {
      risk,
      reward,
      rr: reward / risk
    };
  }).filter(Boolean);

  const average = values => {
    if (!values.length) return null;

    return values.reduce((sum, value) => sum + value, 0)
      / values.length;
  };

  const risks = measured.map(trade => trade.risk);
  const rewards = measured.map(trade => trade.reward);
  const ratios = measured.map(trade => trade.rr);

  const avgRisk = average(risks);
  const maxRisk = risks.length ? Math.max(...risks) : null;
  const avgReward = average(rewards);
  const avgRR = average(ratios);

  let variation = null;

  if (risks.length >= 2 && avgRisk > 0) {
    const variance = average(
      risks.map(risk => (risk - avgRisk) ** 2)
    );

    variation = (Math.sqrt(variance) / avgRisk) * 100;
  }

  setText(
    "averageRisk",
    avgRisk === null ? "—" : formatMoney(avgRisk)
  );

  setText(
    "maximumRisk",
    maxRisk === null ? "—" : formatMoney(maxRisk)
  );

  setText(
    "averageReward",
    avgReward === null ? "—" : formatMoney(avgReward)
  );

  setText(
    "averageRR",
    avgRR === null ? "—" : "1:" + avgRR.toFixed(2)
  );

  setText(
    "riskConsistency",
    variation === null
      ? "Need 2+ trades"
      : variation.toFixed(1) + "% variation"
  );

  setText(
    "riskMessage",
    measured.length
      ? "Planned risk calculated from " + measured.length +
        " valid trade(s). This is estimated risk, not guaranteed actual loss."
      : "No valid risk data yet. Save trades with valid entry, stop-loss, target and quantity."
  );
}

// ---------- Position Size Calculator ----------

function calculatePositionSize() {
  const capital = Number(getElement("capital").value);
  const riskPercent = Number(getElement("riskPercent").value);
  const entry = Number(getElement("entryPrice").value);
  const stopLoss = Number(getElement("stopLossPrice").value);

  if (
    !Number.isFinite(capital) ||
    !Number.isFinite(riskPercent) ||
    !Number.isFinite(entry) ||
    !Number.isFinite(stopLoss) ||
    capital <= 0 ||
    riskPercent <= 0 ||
    riskPercent > 100 ||
    entry <= 0 ||
    stopLoss <= 0 ||
    entry === stopLoss
  ) {
    setText("positionRisk", "—");
    setText("positionQuantity", "—");
    setText("positionValue", "—");
    showMessage("positionMessage", "Enter valid values. Entry and stop-loss must differ.");
    return;
  }

  const riskPerUnit = Math.abs(entry - stopLoss);
  const maxLoss = capital * (riskPercent / 100);
  const quantity = Math.floor(maxLoss / riskPerUnit);
  const positionValue = quantity * entry;

  setText("positionRisk", formatMoney(maxLoss));
  setText("positionQuantity", String(quantity));
  setText("positionValue", formatMoney(positionValue));

  if (quantity < 1) {
    showMessage(
      "positionMessage",
      "Your risk budget is too small for even one unit at this stop-loss distance. Do not force a trade."
    );
  } else if (positionValue > capital) {
    showMessage(
      "positionMessage",
      "The risk-based quantity exceeds your capital buying power. Reduce quantity or do not take the trade."
    );
  } else {
    showMessage(
      "positionMessage",
      "Estimated size only. Confirm margin, lot size, charges and slippage before any real trade."
    );
  }
}

// ---------- Profit/Loss Chart ----------

function createPLChart() {
  const canvas = getElement("plChart");
  if (!canvas) return;

  if (typeof Chart === "undefined") {
    showMessage(
      "riskMessage",
      "Chart.js could not load. Connect to the internet to display the chart."
    );
    return;
  }

  const trades = getTrades();

  const labels = trades.map((trade, index) => {
    const date = trade.date ? new Date(trade.date) : null;
    const dateLabel = date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-IN")
      : "Trade " + (index + 1);

    return (index + 1) + ". " + dateLabel;
  });

  const values = trades.map(trade => calculateTradePL(trade));

  if (plChart) {
    plChart.destroy();
  }

  plChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Trade P/L (₹)",
        data: values,
        backgroundColor: values.map(value =>
          value >= 0 ? "#12805c" : "#c62828"
        ),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Profit / Loss (₹)"
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

// ---------- Trade History Table ----------

function renderTradeHistory() {
  const tbody = getElement("tradeTableBody");
  if (!tbody) return;

  const trades = getTrades();

  if (!trades.length) {
    tbody.innerHTML =
      '<tr><td colspan="8">No trades saved yet.</td></tr>';
    return;
  }

  tbody.replaceChildren();

  trades.slice().reverse().forEach(trade => {
    const row = document.createElement("tr");

    const date = trade.date ? new Date(trade.date) : null;
    const dateText = date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-IN")
      : "—";

    const values = [
      dateText,
      String(trade.symbol || "—"),
      String(trade.side || "Buy"),
      formatMoney(Number(trade.entry)),
      formatMoney(Number(trade.exit)),
      String(trade.quantity ?? "—"),
      formatMoney(calculateTradePL(trade))
    ];

    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      if (index === 6) {
        const pl = calculateTradePL(trade);
        if (pl > 0) cell.classList.add("positive");
        if (pl < 0) cell.classList.add("negative");
      }

      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-one";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteTrade(trade.id);
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

// ---------- Delete One Trade ----------

function deleteTrade(id) {
  if (!id) {
    showMessage(
      "tradeMessage",
      "This older trade has no ID. Export your data before making changes."
    );
    return;
  }

  const confirmed = window.confirm("Delete this trade permanently?");
  if (!confirmed) return;

  const updatedTrades = getTrades().filter(
    trade => String(trade.id) !== String(id)
  );

  if (saveTrades(updatedTrades)) {
    showMessage("tradeMessage", "Trade deleted.");
    refreshDashboard();
  }
}

// ---------- Export CSV ----------

function exportCSV() {
  const trades = getTrades();

  if (!trades.length) {
    showMessage("tradeMessage", "There are no trades to export.");
    return;
  }

  const headers = [
    "Date",
    "Symbol",
    "Side",
    "Entry",
    "Exit",
    "Stop Loss",
    "Target",
    "Quantity",
    "Profit Loss"
  ];

  const escapeCSV = value => {
    const text = String(value ?? "");
    return '"' + text.replace(/"/g, '""') + '"';
  };

  const rows = trades.map(trade => [
    trade.date || "",
    trade.symbol || "",
    trade.side || "Buy",
    trade.entry ?? "",
    trade.exit ?? "",
    trade.stopLoss ?? "",
    trade.target ?? "",
    trade.quantity ?? "",
    calculateTradePL(trade)
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "pradhan16-trades.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// ---------- Delete All Trades ----------

function clearAllTrades() {
  if (!getTrades().length) {
    showMessage("tradeMessage", "No trades to delete.");
    return;
  }

  const confirmed = window.confirm(
    "Delete ALL saved trades? This cannot be undone. Export a backup first if needed."
  );

  if (!confirmed) return;

  if (saveTrades([])) {
    showMessage("tradeMessage", "All trades deleted.");
    refreshDashboard();
  }
}

// ---------- Refresh Everything ----------

function refreshDashboard() {
  calculateStatistics();
  calculateRiskMetrics();
  renderTradeHistory();
  createPLChart();
}

// ---------- Start the App ----------

document.addEventListener("DOMContentLoaded", () => {
  const tradeForm = getElement("tradeForm");
  if (tradeForm) {
    tradeForm.addEventListener("submit", saveTrade);
  }

  const positionButton = getElement("calculatePositionButton");
  if (positionButton) {
    positionButton.addEventListener("click", calculatePositionSize);
  }

  const exportButton = getElement("exportButton");
  if (exportButton) {
    exportButton.addEventListener("click", exportCSV);
  }

  const clearButton = getElement("clearTradesButton");
  if (clearButton) {
    clearButton.addEventListener("click", clearAllTrades);
  }

  calculatePositionSize();
  refreshDashboard();
});