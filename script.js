/* =========================================
   DAY 25 — RISK METRICS
   ========================================= */

function calculateRiskMetrics() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    console.log("Risk Metrics Trades:", trades);

    if (trades.length === 0) {
        setText("averageRisk", "0.00");
        setText("maximumRisk", "0.00");
        setText("averageReward", "0.00");
        setText("averageRR", "0.00");
        setText("riskConsistency", "0%");
        return;
    }

    let totalRisk = 0;
    let maximumRisk = 0;
    let totalReward = 0;

    trades.forEach(trade => {

        const entry = Number(trade.entry) || 0;
        const exit = Number(trade.exit) || 0;
        const quantity = Number(trade.quantity) || 0;
        const pl = Number(trade.profitLoss) || 0;

        const risk =
            Math.abs(exit - entry) * quantity;

        totalRisk += risk;

        if (risk > maximumRisk) {
            maximumRisk = risk;
        }

        if (pl > 0) {
            totalReward += pl;
        }
    });

    const averageRisk =
        totalRisk / trades.length;

    const averageReward =
        totalReward / trades.length;

    const averageRR =
        averageRisk > 0
            ? averageReward / averageRisk
            : 0;

    setText(
        "averageRisk",
        averageRisk.toFixed(2)
    );

    setText(
        "maximumRisk",
        maximumRisk.toFixed(2)
    );

    setText(
        "averageReward",
        averageReward.toFixed(2)
    );

    setText(
        "averageRR",
        averageRR.toFixed(2)
    );

    setText(
        "riskConsistency",
        "Calculated"
    );
}

/* =========================================
   Pradhan16 AI — Trading Journal
   Day 20 — Statistics
   Day 21 — P/L Chart
   Day 23 — Equity Curve
   Day 24 — Drawdown
   ========================================= */


/* ---------- OPEN JOURNAL ---------- */

function openJournal() {
    const journal = document.getElementById("journal");

    if (journal) {
        journal.style.display = "block";
    }
}


/* ---------- CALCULATE P/L ---------- */

function calculatePL() {

    const entry = Number(document.getElementById("entry").value);
    const exit = Number(document.getElementById("exit").value);
    const quantity = Number(document.getElementById("quantity").value);

    if (!entry || !exit || !quantity) {
        document.getElementById("plMessage").innerText =
            "Please enter Entry, Exit and Quantity.";
        return;
    }

    const profitLoss = (exit - entry) * quantity;

    document.getElementById("plMessage").innerText =
        "P/L: ₹" + profitLoss.toFixed(2);
}


/* ---------- SAVE TRADE ---------- */

function saveTrade() {

    const symbol = document.getElementById("symbol").value.trim();
    const entry = Number(document.getElementById("entry").value);
    const exit = Number(document.getElementById("exit").value);
    const quantity = Number(document.getElementById("quantity").value);

    if (!symbol || !entry || !exit || !quantity) {

        document.getElementById("tradeMessage").innerText =
            "Please fill all trade details.";

        return;
    }

    const profitLoss = (exit - entry) * quantity;

    const trade = {
        symbol: symbol,
        entry: entry,
        exit: exit,
        quantity: quantity,
        profitLoss: profitLoss,
        date: new Date().toLocaleString()
    };

    let trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    trades.push(trade);

    localStorage.setItem(
        "pradhan16_trades",
        JSON.stringify(trades)
    );

    document.getElementById("tradeMessage").innerText =
        "✅ Trade saved successfully!";

    refreshDashboard();
}


/* ---------- REVIEW ---------- */

function openReview() {

    const review = document.getElementById("review");
    const reviewMessage = document.getElementById("reviewMessage");

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    review.style.display = "block";

    if (trades.length === 0) {
        reviewMessage.innerText = "No saved trades found.";
        return;
    }

    let html = "<h3>Trade History</h3>";

    trades.forEach((trade, index) => {

        html += `
            <div>
                <strong>Trade ${index + 1}</strong><br>
                Symbol: ${trade.symbol}<br>
                Entry: ₹${trade.entry}<br>
                Exit: ₹${trade.exit}<br>
                Quantity: ${trade.quantity}<br>
                P/L: ₹${Number(trade.profitLoss).toFixed(2)}<br>
                Date: ${trade.date}
                <hr>
            </div>
        `;

    });

    reviewMessage.innerHTML = html;
}


/* =========================================
   DAY 20 — STATISTICS
   ========================================= */

function calculateStatistics() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    const totalTrades = trades.length;

    let winningTrades = 0;
    let losingTrades = 0;

    let grossProfit = 0;
    let grossLoss = 0;

    trades.forEach(trade => {

        const pl = Number(trade.profitLoss) || 0;

        if (pl > 0) {
            winningTrades++;
            grossProfit += pl;
        }

        if (pl < 0) {
            losingTrades++;
            grossLoss += Math.abs(pl);
        }

    });

    const winRate =
        totalTrades > 0
            ? (winningTrades / totalTrades) * 100
            : 0;

    const averageProfit =
        winningTrades > 0
            ? grossProfit / winningTrades
            : 0;

    const averageLoss =
        losingTrades > 0
            ? grossLoss / losingTrades
            : 0;

    const profitFactor =
        grossLoss > 0
            ? grossProfit / grossLoss
            : 0;

    const lossRate =
        totalTrades > 0
            ? losingTrades / totalTrades
            : 0;

    const expectancy =
        (winRate / 100 * averageProfit)
        -
        (lossRate * averageLoss);


    /* DISPLAY */

    setText("totalTrades", totalTrades);
    setText("winningTrades", winningTrades);
    setText("losingTrades", losingTrades);

    setText("winRate", winRate.toFixed(2) + "%");

    setText("grossProfit", grossProfit.toFixed(2));
    setText("grossLoss", grossLoss.toFixed(2));

    setText("averageProfit", averageProfit.toFixed(2));
    setText("averageLoss", averageLoss.toFixed(2));

    setText("profitFactor", profitFactor.toFixed(2));
    setText("expectancy", expectancy.toFixed(2));
}


/* ---------- HELPER ---------- */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================
   DAY 21 — P/L PERFORMANCE
   ========================================= */

let plChart = null;

function createPLChart() {

    const canvas = document.getElementById("plChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.log("Chart.js not available.");
        return;
    }

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    const labels = trades.map(
        (trade, index) => "Trade " + (index + 1)
    );

    const data = trades.map(
        trade => Number(trade.profitLoss) || 0
    );

    if (plChart) {
        plChart.destroy();
    }

    plChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Profit / Loss",

                data: data

            }]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });
}


/* =========================================
   DAY 23 — EQUITY CURVE
   ========================================= */

let equityChart = null;

function updateEquityChart() {

    const canvas = document.getElementById("equityChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        return;
    }

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    let cumulativePL = 0;

    const labels = [];
    const data = [];

    trades.forEach((trade, index) => {

        const pl = Number(trade.profitLoss) || 0;

        cumulativePL += pl;

        labels.push("Trade " + (index + 1));
        data.push(cumulativePL);

    });

    if (equityChart) {
        equityChart.destroy();
    }

    equityChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Cumulative P&L",

                data: data,

                tension: 0.3,

                fill: false,

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: false
                }

            }

        }

    });
}


/* =========================================
   DAY 24 — DRAWDOWN
   ========================================= */

function calculateDrawdown() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    let cumulativePL = 0;
    let peakPL = 0;

    let currentDrawdown = 0;
    let maxDrawdown = 0;

    trades.forEach(trade => {

        const pl = Number(trade.profitLoss) || 0;

        cumulativePL += pl;

        if (cumulativePL > peakPL) {
            peakPL = cumulativePL;
        }

        currentDrawdown =
            peakPL - cumulativePL;

        if (currentDrawdown > maxDrawdown) {
            maxDrawdown = currentDrawdown;
        }

    });

    setText(
        "currentDrawdown",
        "₹" + currentDrawdown.toFixed(2)
    );

    setText(
        "maxDrawdown",
        "₹" + maxDrawdown.toFixed(2)
    );

    setText(
        "peakPL",
        "₹" + peakPL.toFixed(2)
    );

    setText(
        "currentPL",
        "₹" + cumulativePL.toFixed(2)
    );
}
function calculateRiskReward() {

    const entry = Number(document.getElementById("rrEntry").value);
    const stopLoss = Number(document.getElementById("rrStopLoss").value);
    const target = Number(document.getElementById("rrTarget").value);
    const quantity = Number(document.getElementById("rrQuantity").value);

    console.log("DAY 26:", entry, stopLoss, target, quantity);

    if (!entry || !stopLoss || !target || !quantity) {
        document.getElementById("rrStatus").innerText =
            "Enter all values";
        return;
    }

    const riskAmount =
        Math.abs(entry - stopLoss) * quantity;

    const rewardAmount =
        Math.abs(target - entry) * quantity;

    const ratio =
        riskAmount > 0
            ? rewardAmount / riskAmount
            : 0;

    document.getElementById("riskAmount").innerText =
        riskAmount.toFixed(2);

    document.getElementById("rewardAmount").innerText =
        rewardAmount.toFixed(2);

    document.getElementById("riskRewardRatio").innerText =
        "1 : " + ratio.toFixed(2);

    document.getElementById("rrStatus").innerText =
        "Calculated ✅";
}
/* =========================================
   DAY 27 — POSITION SIZE CALCULATOR
   ========================================= */

function calculatePositionSize() {

    const capital = Number(
        document.getElementById("capital").value
    );

    const riskPercent = Number(
        document.getElementById("riskPercent").value
    );

    const entryPrice = Number(
        document.getElementById("entryPrice").value
    );

    const stopLossPrice = Number(
        document.getElementById("stopLossPrice").value
    );

    console.log(
        "Day 27:",
        capital,
        riskPercent,
        entryPrice,
        stopLossPrice
    );

    if (
        capital <= 0 ||
        riskPercent <= 0 ||
        entryPrice <= 0 ||
        stopLossPrice <= 0
    ) {
        alert("Please enter all values");
        return;
    }

    const riskAmount =
        capital * riskPercent / 100;

    const riskPerUnit =
        Math.abs(entryPrice - stopLossPrice);

    const quantity =
        Math.floor(riskAmount / riskPerUnit);

    document.getElementById("positionRisk").innerText =
        riskAmount.toFixed(2);

    document.getElementById("riskPerUnit").innerText =
        riskPerUnit.toFixed(2);

    document.getElementById("positionQuantity").innerText =
        quantity;
}
/* =========================================
   DAY 28 — RISK DASHBOARD
   ========================================= */

function updateRiskDashboard() {

    const capital =
        Number(document.getElementById("capital").value) || 0;

    const riskPercent =
        Number(document.getElementById("riskPercent").value) || 0;

    const entryPrice =
        Number(document.getElementById("entryPrice").value) || 0;

    const stopLossPrice =
        Number(document.getElementById("stopLossPrice").value) || 0;


    const riskAmount =
        capital * (riskPercent / 100);

    const riskPerUnit =
        Math.abs(entryPrice - stopLossPrice);

    const positionSize =
        riskPerUnit > 0
            ? Math.floor(riskAmount / riskPerUnit)
            : 0;


    document.getElementById("dashboardCapital").innerText =
        capital.toFixed(2);

    document.getElementById("dashboardRiskPercent").innerText =
        riskPercent.toFixed(2) + "%";

    document.getElementById("dashboardRiskAmount").innerText =
        riskAmount.toFixed(2);

    document.getElementById("dashboardRiskPerUnit").innerText =
        riskPerUnit.toFixed(2);

    document.getElementById("dashboardPositionSize").innerText =
        positionSize;
}
        
/* =========================================
   REFRESH EVERYTHING
   ========================================= */

function refreshDashboard() {

    calculateStatistics();

    createPLChart();

    updateEquityChart();

    calculateDrawdown();

    calculateRiskMetrics();

}



/* =========================================
   APP START
   ========================================= */

window.addEventListener("load", function () {

    refreshDashboard();

});