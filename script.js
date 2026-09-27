/* =========================================
   Pradhan16 AI — Trading Journal
   Day 20: Statistics
   Day 21: P/L Performance Chart
   Day 23: Equity Curve
   Day 24: Drawdown Analysis
   ========================================= */


/* =========================================
   OPEN TRADING JOURNAL
   ========================================= */

function openJournal() {
    document.getElementById("journal").style.display = "block";
}


/* =========================================
   CALCULATE PROFIT / LOSS
   ========================================= */

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


/* =========================================
   SAVE TRADE
   ========================================= */

function saveTrade() {

    const symbol =
        document.getElementById("symbol").value.trim();

    const entry =
        Number(document.getElementById("entry").value);

    const exit =
        Number(document.getElementById("exit").value);

    const quantity =
        Number(document.getElementById("quantity").value);


    if (!symbol || !entry || !exit || !quantity) {

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


    // Update everything
    calculateStatistics();
    createPLChart();
    updateEquityChart();
    calculateDrawdown();
}


/* =========================================
   OPEN TRADE REVIEW
   ========================================= */

function openReview() {

    const review =
        document.getElementById("review");

    const reviewMessage =
        document.getElementById("reviewMessage");


    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    review.style.display = "block";


    if (trades.length === 0) {

        reviewMessage.innerText =
            "No saved trades found.";

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
   DAY 19 — BASIC TRADE STATISTICS
   ========================================= */

function getTradeStats() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    let totalPL = 0;
    let wins = 0;
    let losses = 0;


    trades.forEach(trade => {

        const pl =
            Number(trade.profitLoss) || 0;

        totalPL += pl;


        if (pl > 0) {
            wins++;
        }

        else if (pl < 0) {
            losses++;
        }

    });


    return {

        totalTrades: trades.length,
        totalPL: totalPL,
        wins: wins,
        losses: losses

    };
}


/* =========================================
   DAY 20 — TRADING STATISTICS
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

        const pl =
            Number(trade.profitLoss) || 0;


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


    /* -----------------------------------------
       DISPLAY
       ----------------------------------------- */

    const totalTradesElement =
        document.getElementById("totalTrades");

    if (totalTradesElement)
        totalTradesElement.textContent = totalTrades;


    const winningTradesElement =
        document.getElementById("winningTrades");

    if (winningTradesElement)
        winningTradesElement.textContent = winningTrades;


    const losingTradesElement =
        document.getElementById("losingTrades");

    if (losingTradesElement)
        losingTradesElement.textContent = losingTrades;


    const winRateElement =
        document.getElementById("winRate");

    if (winRateElement)
        winRateElement.textContent =
            winRate.toFixed(2) + "%";


    const grossProfitElement =
        document.getElementById("grossProfit");

    if (grossProfitElement)
        grossProfitElement.textContent =
            grossProfit.toFixed(2);


    const grossLossElement =
        document.getElementById("grossLoss");

    if (grossLossElement)
        grossLossElement.textContent =
            grossLoss.toFixed(2);


    const averageProfitElement =
        document.getElementById("averageProfit");

    if (averageProfitElement)
        averageProfitElement.textContent =
            averageProfit.toFixed(2);


    const averageLossElement =
        document.getElementById("averageLoss");

    if (averageLossElement)
        averageLossElement.textContent =
            averageLoss.toFixed(2);


    const profitFactorElement =
        document.getElementById("profitFactor");

    if (profitFactorElement)
        profitFactorElement.textContent =
            profitFactor.toFixed(2);


    const expectancyElement =
        document.getElementById("expectancy");

    if (expectancyElement)
        expectancyElement.textContent =
            expectancy.toFixed(2);
}


/* =========================================
   DAY 21 — P/L PERFORMANCE CHART
   ========================================= */

let plChart = null;


function createPLChart() {

    const canvas =
        document.getElementById("plChart");


    if (!canvas) {
        return;
    }


    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    const labels = trades.map((trade, index) =>
        "Trade " + (index + 1)
    );


    const profitLoss = trades.map(trade =>
        Number(trade.profitLoss) || 0
    );


    if (plChart) {
        plChart.destroy();
    }


    // Check Chart.js
    if (typeof Chart === "undefined") {
        console.error("Chart.js not loaded.");
        return;
    }


    plChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Profit / Loss",

                data: profitLoss

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

    const canvas =
        document.getElementById("equityChart");


    if (!canvas) {
        return;
    }


    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    let cumulativePL = 0;


    const labels = [];
    const equityData = [];


    trades.forEach((trade, index) => {

        const pl =
            Number(trade.profitLoss) || 0;


        cumulativePL += pl;


        labels.push(
            "Trade " + (index + 1)
        );


        equityData.push(cumulativePL);

    });


    if (equityChart) {
        equityChart.destroy();
    }


    if (typeof Chart === "undefined") {
        console.error("Chart.js not loaded.");
        return;
    }


    equityChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Cumulative P&L",

                data: equityData,

                tension: 0.3,

                fill: false,

                borderWidth: 2,

                pointRadius: 4

            }]

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    title: {

                        display: true,

                        text: "P&L (₹)"

                    }

                },

                x: {

                    title: {

                        display: true,

                        text: "Trades"

                    }

                }

            }

        }

    });
}


/* =========================================
   DAY 24 — DRAWDOWN ANALYSIS
   ========================================= */

function calculateDrawdown() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    let cumulativePL = 0;
    let peakPL = 0;

    let currentDrawdown = 0;
    let maxDrawdown = 0;

    let maxDrawdownPeak = 0;
    let maxDrawdownBottom = 0;


    trades.forEach(trade => {

        const pl =
            Number(trade.profitLoss) || 0;


        cumulativePL += pl;


        if (cumulativePL > peakPL) {

            peakPL = cumulativePL;

        }


        currentDrawdown =
            peakPL - cumulativePL;


        if (currentDrawdown > maxDrawdown) {

            maxDrawdown =
                currentDrawdown;

            maxDrawdownPeak =
                peakPL;

            maxDrawdownBottom =
                cumulativePL;

        }

    });


    const currentDrawdownElement =
        document.getElementById("currentDrawdown");

    if (currentDrawdownElement) {

        currentDrawdownElement.textContent =
            "₹" + currentDrawdown.toFixed(2);

    }


    const maxDrawdownElement =
        document.getElementById("maxDrawdown");

    if (maxDrawdownElement) {

        maxDrawdownElement.textContent =
            "₹" + maxDrawdown.toFixed(2);

    }


    const peakPLElement =
        document.getElementById("peakPL");

    if (peakPLElement) {

        peakPLElement.textContent =
            "₹" + peakPL.toFixed(2);

    }


    const currentPLElement =
        document.getElementById("currentPL");

    if (currentPLElement) {

        currentPLElement.textContent =
            "₹" + cumulativePL.toFixed(2);

    }


    return {

        currentPL: cumulativePL,

        peakPL: peakPL,

        currentDrawdown: currentDrawdown,

        maxDrawdown: maxDrawdown,

        maxDrawdownPeak: maxDrawdownPeak,

        maxDrawdownBottom: maxDrawdownBottom

    };

}


/* =========================================
   APP START
   ========================================= */

window.addEventListener("load", function () {

    calculateStatistics();

    createPLChart();

    updateEquityChart();

    calculateDrawdown();

});