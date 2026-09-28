alert("Pradhan16 JavaScript Loaded!");

/* =========================================================
   PRADHAN16 AI — TRADING JOURNAL
   DAY 17 → DAY 29
   ========================================================= */


/* =========================================================
   COMMON HELPERS
   ========================================================= */

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function getTrades() {
    try {
        return JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );
    } catch (error) {
        console.error("Trade data error:", error);
        return [];
    }
}


/* =========================================================
   DAY 17 — OPEN TRADING JOURNAL
   ========================================================= */

function openJournal() {

    const journal = document.getElementById("journal");

    if (journal) {
        journal.style.display = "block";
    }
}


/* =========================================================
   DAY 18 — CALCULATE P/L
   ========================================================= */

function calculatePL() {

    const entry =
        Number(document.getElementById("entry")?.value) || 0;

    const exit =
        Number(document.getElementById("exit")?.value) || 0;

    const quantity =
        Number(document.getElementById("quantity")?.value) || 0;

    if (entry <= 0 || exit <= 0 || quantity <= 0) {

        setText(
            "plMessage",
            "Please enter valid values."
        );

        return;
    }

    const profitLoss =
        (exit - entry) * quantity;

    setText(
        "plMessage",
        "P/L: ₹" + profitLoss.toFixed(2)
    );
}


/* =========================================================
   DAY 18 — SAVE TRADE
   ========================================================= */

function saveTrade() {

    const symbol =
        document.getElementById("symbol")?.value.trim();

    const entry =
        Number(document.getElementById("entry")?.value) || 0;

    const exit =
        Number(document.getElementById("exit")?.value) || 0;

    const quantity =
        Number(document.getElementById("quantity")?.value) || 0;

    if (!symbol || entry <= 0 || exit <= 0 || quantity <= 0) {

        alert("Please enter all trade details.");

        return;
    }

    const profitLoss =
        (exit - entry) * quantity;

    const trade = {
        symbol: symbol,
        entry: entry,
        exit: exit,
        quantity: quantity,
        profitLoss: profitLoss,
        date: new Date().toLocaleString()
    };

    const trades = getTrades();

    trades.push(trade);

    localStorage.setItem(
        "pradhan16_trades",
        JSON.stringify(trades)
    );

    alert("Trade saved successfully!");

    refreshDashboard();
}


/* =========================================================
   DAY 18 — OPEN TRADE REVIEW
   ========================================================= */

function openReview() {

    const review =
        document.getElementById("review");

    const container =
        document.getElementById("tradeList");

    if (review) {
        review.style.display = "block";
    }

    if (!container) {
        return;
    }

    const trades = getTrades();

    if (trades.length === 0) {

        container.innerHTML =
            "<p>No trades yet.</p>";

        return;
    }

    container.innerHTML = "";

    trades
        .slice()
        .reverse()
        .forEach((trade, index) => {

            const div =
                document.createElement("div");

            const pl =
                Number(trade.profitLoss) || 0;

            div.innerHTML = `

                <hr>

                <h3>
                    Trade ${trades.length - index}
                </h3>

                <p>
                    Symbol:
                    ${trade.symbol}
                </p>

                <p>
                    Entry:
                    ₹${Number(trade.entry).toFixed(2)}
                </p>

                <p>
                    Exit:
                    ₹${Number(trade.exit).toFixed(2)}
                </p>

                <p>
                    Quantity:
                    ${Number(trade.quantity)}
                </p>

                <p>
                    P/L:
                    ₹${pl.toFixed(2)}
                </p>

                <p>
                    Date:
                    ${trade.date}
                </p>

            `;

            container.appendChild(div);
        });
}


/* =========================================================
   DAY 20 — TRADING STATISTICS
   ========================================================= */

function calculateStatistics() {

    const trades = getTrades();

    const totalTrades =
        trades.length;

    const winningTrades =
        trades.filter(
            trade =>
                Number(trade.profitLoss) > 0
        );

    const losingTrades =
        trades.filter(
            trade =>
                Number(trade.profitLoss) < 0
        );

    const grossProfit =
        winningTrades.reduce(
            (sum, trade) =>
                sum + Number(trade.profitLoss),
            0
        );

    const grossLoss =
        Math.abs(
            losingTrades.reduce(
                (sum, trade) =>
                    sum + Number(trade.profitLoss),
                0
            )
        );

    const winRate =
        totalTrades > 0
            ? (winningTrades.length / totalTrades) * 100
            : 0;

    const averageProfit =
        winningTrades.length > 0
            ? grossProfit / winningTrades.length
            : 0;

    const averageLoss =
        losingTrades.length > 0
            ? grossLoss / losingTrades.length
            : 0;

    const profitFactor =
        grossLoss > 0
            ? grossProfit / grossLoss
            : 0;

    const expectancy =
        totalTrades > 0
            ? (
                grossProfit - grossLoss
            ) / totalTrades
            : 0;

    setText("totalTrades", totalTrades);

    setText(
        "winningTrades",
        winningTrades.length
    );

    setText(
        "losingTrades",
        losingTrades.length
    );

    setText(
        "winRate",
        winRate.toFixed(2) + "%"
    );

    setText(
        "grossProfit",
        grossProfit.toFixed(2)
    );

    setText(
        "grossLoss",
        grossLoss.toFixed(2)
    );

    setText(
        "averageProfit",
        averageProfit.toFixed(2)
    );

    setText(
        "averageLoss",
        averageLoss.toFixed(2)
    );

    setText(
        "profitFactor",
        profitFactor.toFixed(2)
    );

    setText(
        "expectancy",
        expectancy.toFixed(2)
    );
}


/* =========================================================
   DAY 21 — P/L CHART
   ========================================================= */

function createPLChart() {

    const canvas =
        document.getElementById("plChart");

    if (!canvas) {
        return;
    }

    const trades = getTrades();

    const labels =
        trades.map(
            (_, index) =>
                "Trade " + (index + 1)
        );

    const data =
        trades.map(
            trade =>
                Number(trade.profitLoss) || 0
        );

    if (window.pradhanPLChart) {
        window.pradhanPLChart.destroy();
    }

    if (typeof Chart === "undefined") {
        console.warn("Chart.js not loaded.");
        return;
    }

    window.pradhanPLChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "Profit / Loss",
                        data: data
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
}


/* =========================================================
   DAY 23 — EQUITY CURVE
   ========================================================= */

function updateEquityChart() {

    const canvas =
        document.getElementById("equityChart");

    if (!canvas) {
        return;
    }

    const trades = getTrades();

    let cumulativePL = 0;

    const equityData =
        trades.map(trade => {

            cumulativePL +=
                Number(trade.profitLoss) || 0;

            return cumulativePL;
        });

    const labels =
        trades.map(
            (_, index) =>
                "Trade " + (index + 1)
        );

    if (window.pradhanEquityChart) {
        window.pradhanEquityChart.destroy();
    }

    if (typeof Chart === "undefined") {
        console.warn("Chart.js not loaded.");
        return;
    }

    window.pradhanEquityChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "Equity Curve",
                        data: equityData,
                        tension: 0.2
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
}


/* =========================================================
   DAY 22 / 24 — DRAWDOWN ANALYSIS
   ========================================================= */

function calculateDrawdown() {

    const trades = getTrades();

    let cumulativePL = 0;
    let peak = 0;
    let maxDrawdown = 0;

    trades.forEach(trade => {

        cumulativePL +=
            Number(trade.profitLoss) || 0;

        if (cumulativePL > peak) {
            peak = cumulativePL;
        }

        const drawdown =
            peak - cumulativePL;

        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });

    const currentDrawdown =
        peak - cumulativePL;

    setText(
        "currentDrawdown",
        currentDrawdown.toFixed(2)
    );

    setText(
        "maxDrawdown",
        maxDrawdown.toFixed(2)
    );

    setText(
        "peakPL",
        peak.toFixed(2)
    );

    setText(
        "currentPL",
        cumulativePL.toFixed(2)
    );
}


/* =========================================================
   DAY 25 — RISK METRICS
   ========================================================= */

function calculateRiskMetrics() {

    const trades = getTrades();

    if (trades.length === 0) {

        setText("averageRisk", "0.00");
        setText("maximumRisk", "0.00");
        setText("averageReward", "0.00");
        setText("averageRR", "0.00");
        setText("riskConsistency", "No data");

        return;
    }

    const risks =
        trades.map(trade => {

            const entry =
                Number(trade.entry) || 0;

            const exit =
                Number(trade.exit) || 0;

            const quantity =
                Number(trade.quantity) || 0;

            return Math.abs(exit - entry) * quantity;
        });

    const rewards =
        trades
            .filter(
                trade =>
                    Number(trade.profitLoss) > 0
            )
            .map(
                trade =>
                    Number(trade.profitLoss)
            );

    const averageRisk =
        risks.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / risks.length;

    const maximumRisk =
        Math.max(...risks);

    const averageReward =
        rewards.length > 0
            ? rewards.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / rewards.length
            : 0;

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


/* =========================================================
   DAY 26 — RISK / REWARD CALCULATOR
   ========================================================= */

function calculateRiskReward() {

    const entry =
        Number(document.getElementById("rrEntry")?.value) || 0;

    const stopLoss =
        Number(document.getElementById("rrStopLoss")?.value) || 0;

    const target =
        Number(document.getElementById("rrTarget")?.value) || 0;

    const quantity =
        Number(document.getElementById("rrQuantity")?.value) || 0;

    if (
        entry <= 0 ||
        stopLoss <= 0 ||
        target <= 0 ||
        quantity <= 0
    ) {

        alert(
            "Please enter all Risk/Reward values."
        );

        return;
    }

    const risk =
        Math.abs(entry - stopLoss) * quantity;

    const reward =
        Math.abs(target - entry) * quantity;

    if (risk <= 0) {

        alert("Risk cannot be zero.");

        return;
    }

    const ratio =
        reward / risk;

    setText(
        "riskAmount",
        risk.toFixed(2)
    );

    setText(
        "rewardAmount",
        reward.toFixed(2)
    );

    setText(
        "riskRewardRatio",
        ratio.toFixed(2)
    );

    setText(
        "rrStatus",
        ratio >= 2
            ? "Good Risk/Reward"
            : "Low Risk/Reward"
    );

    updateRiskDashboard();
}


/* =========================================================
   DAY 27 — POSITION SIZE CALCULATOR
   ========================================================= */

function calculatePositionSize() {

    const capital =
        Number(document.getElementById("capital")?.value) || 0;

    const riskPercent =
        Number(document.getElementById("riskPercent")?.value) || 0;

    const entryPrice =
        Number(document.getElementById("entryPrice")?.value) || 0;

    const stopLossPrice =
        Number(document.getElementById("stopLossPrice")?.value) || 0;

    if (
        capital <= 0 ||
        riskPercent <= 0 ||
        entryPrice <= 0 ||
        stopLossPrice <= 0
    ) {

        alert("Please enter all values.");

        return;
    }

    const riskAmount =
        capital * (riskPercent / 100);

    const riskPerUnit =
        Math.abs(entryPrice - stopLossPrice);

    if (riskPerUnit <= 0) {

        alert(
            "Entry Price and Stop Loss cannot be same."
        );

        return;
    }

    const quantity =
        Math.floor(
            riskAmount / riskPerUnit
        );

    setText(
        "positionRisk",
        riskAmount.toFixed(2)
    );

    setText(
        "riskPerUnit",
        riskPerUnit.toFixed(2)
    );

    setText(
        "positionQuantity",
        quantity
    );

    updateRiskDashboard();

    saveRiskHistory();
}


/* =========================================================
   DAY 28 — RISK DASHBOARD
   ========================================================= */

function updateRiskDashboard() {

    const capital =
        Number(document.getElementById("capital")?.value) || 0;

    const riskPercent =
        Number(document.getElementById("riskPercent")?.value) || 0;

    const entryPrice =
        Number(document.getElementById("entryPrice")?.value) || 0;

    const stopLossPrice =
        Number(document.getElementById("stopLossPrice")?.value) || 0;

    const riskAmount =
        capital * (riskPercent / 100);

    const riskPerUnit =
        Math.abs(entryPrice - stopLossPrice);

    const positionSize =
        riskPerUnit > 0
            ? Math.floor(
                riskAmount / riskPerUnit
            )
            : 0;

    const rrRatio =
        Number(
            document.getElementById(
                "riskRewardRatio"
            )?.textContent
        ) || 0;

    setText(
        "dashboardCapital",
        capital.toFixed(2)
    );

    setText(
        "dashboardRiskPercent",
        riskPercent.toFixed(2) + "%"
    );

    setText(
        "dashboardRiskAmount",
        riskAmount.toFixed(2)
    );

    setText(
        "dashboardRiskPerUnit",
        riskPerUnit.toFixed(2)
    );

    setText(
        "dashboardPositionSize",
        positionSize
    );

    setText(
        "dashboardRR",
        rrRatio.toFixed(2)
    );
}


/* =========================================================
   DAY 29 — TRADE RISK HISTORY
   ========================================================= */

function saveRiskHistory() {

    const capital =
        Number(document.getElementById("capital")?.value) || 0;

    const riskPercent =
        Number(document.getElementById("riskPercent")?.value) || 0;

    const entryPrice =
        Number(document.getElementById("entryPrice")?.value) || 0;

    const stopLossPrice =
        Number(document.getElementById("stopLossPrice")?.value) || 0;

    if (
        capital <= 0 ||
        riskPercent <= 0 ||
        entryPrice <= 0 ||
        stopLossPrice <= 0
    ) {
        return;
    }

    const riskAmount =
        capital * (riskPercent / 100);

    const riskPerUnit =
        Math.abs(
            entryPrice -
            stopLossPrice
        );

    const positionSize =
        riskPerUnit > 0
            ? Math.floor(
                riskAmount / riskPerUnit
            )
            : 0;

    const history = JSON.parse(
        localStorage.getItem(
            "pradhan16_risk_history"
        ) || "[]"
    );

    history.push({

        capital: capital,

        riskPercent: riskPercent,

        riskAmount: riskAmount,

        entryPrice: entryPrice,

        stopLossPrice: stopLossPrice,

        riskPerUnit: riskPerUnit,

        positionSize: positionSize,

        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "pradhan16_risk_history",
        JSON.stringify(history)
    );

    displayRiskHistory();
}


/* =========================================================
   DAY 29 — DISPLAY RISK HISTORY
   ========================================================= */

function displayRiskHistory() {

    const container =
        document.getElementById(
            "riskHistory"
        );

    if (!container) {
        return;
    }

    const history = JSON.parse(
        localStorage.getItem(
            "pradhan16_risk_history"
        ) || "[]"
    );

    if (history.length === 0) {

        container.innerHTML =
            "<p>No risk history yet.</p>";

        return;
    }

    container.innerHTML = "";

    history
        .slice()
        .reverse()
        .forEach((item, index) => {

            const div =
                document.createElement("div");

            div.innerHTML = `

                <hr>

                <h3>
                    Risk Record ${history.length - index}
                </h3>

                <p>
                    Capital:
                    ₹${Number(item.capital).toFixed(2)}
                </p>

                <p>
                    Risk:
                    ${Number(item.riskPercent).toFixed(2)}%
                </p>

                <p>
                    Risk Amount:
                    ₹${Number(item.riskAmount).toFixed(2)}
                </p>

                <p>
                    Entry:
                    ₹${Number(item.entryPrice).toFixed(2)}
                </p>

                <p>
                    Stop Loss:
                    ₹${Number(item.stopLossPrice).toFixed(2)}
                </p>

                <p>
                    Risk Per Unit:
                    ₹${Number(item.riskPerUnit).toFixed(2)}
                </p>

                <p>
                    Position Size:
                    ${Number(item.positionSize)}
                </p>

                <p>
                    Date:
                    ${item.date}
                </p>

            `;

            container.appendChild(div);
        });
}


/* =========================================================
   REFRESH ENTIRE DASHBOARD
   ========================================================= */

function refreshDashboard() {

    calculateStatistics();

    createPLChart();

    updateEquityChart();

    calculateDrawdown();

    calculateRiskMetrics();

    updateRiskDashboard();

    displayRiskHistory();
}


/* =========================================================
   APP START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Pradhan16 AI Dashboard Loaded"
        );

        refreshDashboard();
    }
);