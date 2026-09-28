/* =========================================================
   PRADHAN16 AI — COMPLETE SCRIPT
   DAY 17 → DAY 28
   Trading Journal + Statistics + Charts + Risk Tools
   ========================================================= */


/* =========================================================
   COMMON HELPER
   ========================================================= */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   TRADING JOURNAL
   ========================================================= */

function openJournal() {

    const journal =
        document.getElementById("journal");

    if (journal) {
        journal.style.display = "block";
    }
}


/* =========================================================
   CALCULATE P/L
   ========================================================= */

function calculatePL() {

    const entry =
        Number(document.getElementById("entry").value);

    const exit =
        Number(document.getElementById("exit").value);

    const quantity =
        Number(document.getElementById("quantity").value);


    if (
        entry <= 0 ||
        exit <= 0 ||
        quantity <= 0
    ) {

        document.getElementById("plMessage").innerText =
            "Please enter Entry, Exit and Quantity.";

        return;
    }


    const profitLoss =
        (exit - entry) * quantity;


    document.getElementById("plMessage").innerText =
        "P/L: ₹" + profitLoss.toFixed(2);
}


/* =========================================================
   SAVE TRADE
   ========================================================= */

function saveTrade() {

    const symbol =
        document.getElementById("symbol").value.trim();

    const entry =
        Number(document.getElementById("entry").value);

    const exit =
        Number(document.getElementById("exit").value);

    const quantity =
        Number(document.getElementById("quantity").value);


    if (
        !symbol ||
        entry <= 0 ||
        exit <= 0 ||
        quantity <= 0
    ) {

        document.getElementById("tradeMessage").innerText =
            "Please fill all trade details.";

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


    let trades =
        JSON.parse(
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


/* =========================================================
   OPEN TRADE REVIEW
   ========================================================= */

function openReview() {

    const review =
        document.getElementById("review");

    if (!review) return;


    review.style.display = "block";


    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    const tradeList =
        document.getElementById("tradeList");


    if (!tradeList) return;


    tradeList.innerHTML = "";


    if (trades.length === 0) {

        tradeList.innerHTML =
            "<p>No trades available.</p>";

        return;
    }


    trades.forEach((trade, index) => {

        const div =
            document.createElement("div");


        div.innerHTML = `

            <hr>

            <p><strong>Trade ${index + 1}</strong></p>

            <p>Symbol: ${trade.symbol}</p>

            <p>Entry: ₹${Number(trade.entry).toFixed(2)}</p>

            <p>Exit: ₹${Number(trade.exit).toFixed(2)}</p>

            <p>Quantity: ${Number(trade.quantity)}</p>

            <p>
                P/L:
                ₹${Number(trade.profitLoss).toFixed(2)}
            </p>

            <p>Date: ${trade.date}</p>

        `;


        tradeList.appendChild(div);

    });
}


/* =========================================================
   DAY 20 — TRADING STATISTICS
   ========================================================= */

function calculateStatistics() {

    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    const totalTrades =
        trades.length;


    let winningTrades = 0;

    let losingTrades = 0;

    let grossProfit = 0;

    let grossLoss = 0;


    trades.forEach(trade => {

        const pl =
            Number(trade.profitLoss) || 0;


        if (pl > 0) {

            winningTrades++;

            grossProfit += pl;

        }

        else if (pl < 0) {

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
            : grossProfit > 0
                ? Infinity
                : 0;


    const expectancy =
        totalTrades > 0
            ? (
                (winRate / 100) * averageProfit
            ) -
            (
                (1 - winRate / 100) * averageLoss
            )
            : 0;


    setText(
        "totalTrades",
        totalTrades
    );


    setText(
        "winningTrades",
        winningTrades
    );


    setText(
        "losingTrades",
        losingTrades
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
        profitFactor === Infinity
            ? "∞"
            : profitFactor.toFixed(2)
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


    if (!canvas) return;


    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    const labels =
        trades.map(
            (_, index) => "Trade " + (index + 1)
        );


    const values =
        trades.map(
            trade => Number(trade.profitLoss) || 0
        );


    if (
        typeof Chart === "undefined"
    ) {
        return;
    }


    if (window.plChartInstance) {

        window.plChartInstance.destroy();

    }


    window.plChartInstance =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Profit / Loss",

                    data: values

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }

                }

            }

        });
}


/* =========================================================
   DAY 23 — EQUITY CURVE
   ========================================================= */

function updateEquityChart() {

    const canvas =
        document.getElementById("equityChart");


    if (!canvas) return;


    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    let cumulativePL = 0;


    const equity =
        trades.map((trade, index) => {

            cumulativePL +=
                Number(trade.profitLoss) || 0;

            return cumulativePL;

        });


    const labels =
        trades.map(
            (_, index) => "Trade " + (index + 1)
        );


    if (
        typeof Chart === "undefined"
    ) {
        return;
    }


    if (window.equityChartInstance) {

        window.equityChartInstance.destroy();

    }


    window.equityChartInstance =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Equity Curve",

                    data: equity,

                    fill: false,

                    tension: 0.2

                }]

            },

            options: {

                responsive: true

            }

        });
}


/* =========================================================
   DAY 24 — DRAWDOWN
   ========================================================= */

function calculateDrawdown() {

    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    let cumulativePL = 0;

    let peakPL = 0;

    let currentDrawdown = 0;

    let maxDrawdown = 0;


    trades.forEach(trade => {

        cumulativePL +=
            Number(trade.profitLoss) || 0;


        if (cumulativePL > peakPL) {

            peakPL = cumulativePL;

        }


        currentDrawdown =
            peakPL - cumulativePL;


        if (currentDrawdown > maxDrawdown) {

            maxDrawdown =
                currentDrawdown;

        }

    });


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
        peakPL.toFixed(2)
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

    const trades =
        JSON.parse(
            localStorage.getItem("pradhan16_trades") || "[]"
        );


    if (trades.length === 0) {

        setText(
            "averageRisk",
            "0.00"
        );

        setText(
            "maximumRisk",
            "0.00"
        );

        setText(
            "averageReward",
            "0.00"
        );

        setText(
            "averageRR",
            "0.00"
        );

        setText(
            "riskConsistency",
            "0%"
        );

        return;
    }


    let totalRisk = 0;

    let maximumRisk = 0;

    let totalReward = 0;

    let winningTrades = 0;


    trades.forEach(trade => {

        const entry =
            Number(trade.entry) || 0;

        const exit =
            Number(trade.exit) || 0;

        const quantity =
            Number(trade.quantity) || 0;

        const pl =
            Number(trade.profitLoss) || 0;


        const risk =
            Math.abs(exit - entry) * quantity;


        totalRisk += risk;


        if (risk > maximumRisk) {

            maximumRisk = risk;

        }


        if (pl > 0) {

            totalReward += pl;

            winningTrades++;

        }

    });


    const averageRisk =
        totalRisk / trades.length;


    const averageReward =
        winningTrades > 0
            ? totalReward / winningTrades
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
        Number(document.getElementById("rrEntry").value);

    const stopLoss =
        Number(document.getElementById("rrStopLoss").value);

    const target =
        Number(document.getElementById("rrTarget").value);

    const quantity =
        Number(document.getElementById("rrQuantity").value);


    if (
        entry <= 0 ||
        stopLoss <= 0 ||
        target <= 0 ||
        quantity <= 0
    ) {

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


    updateRiskDashboard();
}


/* =========================================================
   DAY 27 — POSITION SIZE CALCULATOR
   ========================================================= */

function calculatePositionSize() {

    const capital =
        Number(document.getElementById("capital").value);

    const riskPercent =
        Number(document.getElementById("riskPercent").value);

    const entryPrice =
        Number(document.getElementById("entryPrice").value);

    const stopLossPrice =
        Number(document.getElementById("stopLossPrice").value);


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
        capital * (riskPercent / 100);


    const riskPerUnit =
        Math.abs(
            entryPrice - stopLossPrice
        );


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


    document.getElementById("positionRisk").innerText =
        riskAmount.toFixed(2);


    document.getElementById("riskPerUnit").innerText =
        riskPerUnit.toFixed(2);


    document.getElementById("positionQuantity").innerText =
        quantity;


    // DAY 28
    updateRiskDashboard();
}


/* =========================================================
   DAY 28 — RISK DASHBOARD
   ========================================================= */

function updateRiskDashboard() {

    const capital =
        Number(
            document.getElementById("capital")?.value
        ) || 0;


    const riskPercent =
        Number(
            document.getElementById("riskPercent")?.value
        ) || 0;


    const entryPrice =
        Number(
            document.getElementById("entryPrice")?.value
        ) || 0;


    const stopLossPrice =
        Number(
            document.getElementById("stopLossPrice")?.value
        ) || 0;


    const riskAmount =
        capital * (riskPercent / 100);


    const riskPerUnit =
        Math.abs(
            entryPrice - stopLossPrice
        );


    const positionSize =
        riskPerUnit > 0
            ? Math.floor(
                riskAmount / riskPerUnit
            )
            : 0;


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


    /* -----------------------------------------
       Risk / Reward
       ----------------------------------------- */

    const rrEntry =
        Number(
            document.getElementById("rrEntry")?.value
        ) || 0;


    const rrStopLoss =
        Number(
            document.getElementById("rrStopLoss")?.value
        ) || 0;


    const rrTarget =
        Number(
            document.getElementById("rrTarget")?.value
        ) || 0;


    let rr = 0;


    if (
        rrEntry > 0 &&
        rrStopLoss > 0 &&
        rrTarget > 0
    ) {

        const risk =
            Math.abs(
                rrEntry - rrStopLoss
            );


        const reward =
            Math.abs(
                rrTarget - rrEntry
            );


        if (risk > 0) {

            rr =
                reward / risk;

        }

    }


    setText(
        "dashboardRR",
        rr.toFixed(2)
    );
}


/* =========================================================
   MASTER DASHBOARD REFRESH
   ========================================================= */

function refreshDashboard() {

    calculateStatistics();

    createPLChart();

    updateEquityChart();

    calculateDrawdown();

    calculateRiskMetrics();

    updateRiskDashboard();
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

window.addEventListener(
    "load",
    function () {

        refreshDashboard();

    }
);
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
        Math.abs(entryPrice - stopLossPrice);

    if (riskPerUnit <= 0) {
        return;
    }

    const quantity =
        Math.floor(riskAmount / riskPerUnit);

    const riskTrade = {

        capital: capital,

        riskPercent: riskPercent,

        entryPrice: entryPrice,

        stopLossPrice: stopLossPrice,

        riskAmount: riskAmount,

        riskPerUnit: riskPerUnit,

        quantity: quantity,

        date: new Date().toLocaleString()

    };


    let history =
        JSON.parse(
            localStorage.getItem(
                "pradhan16_risk_history"
            ) || "[]"
        );


    history.push(riskTrade);


    localStorage.setItem(
        "pradhan16_risk_history",
        JSON.stringify(history)
    );


    displayRiskHistory();
}


/* =========================================================
   DISPLAY RISK HISTORY
   ========================================================= */

function displayRiskHistory() {

    const container =
        document.getElementById("riskHistory");

    if (!container) return;


    const history =
        JSON.parse(
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


    history.slice().reverse().forEach(
        (trade, index) => {

            const div =
                document.createElement("div");


            div.innerHTML = `

                <hr>

                <h3>
                    Trade ${history.length - index}
                </h3>

                <p>
                    Capital:
                    ₹${trade.capital.toFixed(2)}
                </p>

                <p>
                    Risk:
                    ${trade.riskPercent.toFixed(2)}%
                </p>

                <p>
                    Entry:
                    ₹${trade.entryPrice.toFixed(2)}
                </p>

                <p>
                    Stop Loss:
                    ₹${trade.stopLossPrice.toFixed(2)}
                </p>

                <p>
                    Risk Amount:
                    ₹${trade.riskAmount.toFixed(2)}
                </p>

                <p>
                    Risk Per Unit:
                    ₹${trade.riskPerUnit.toFixed(2)}
                </p>

                <p>
                    Position Size:
                    ${trade.quantity}
                </p>

                <p>
                    Date:
                    ${trade.date}
                </p>

            `;


            container.appendChild(div);

        }
    );
}