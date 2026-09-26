/* =========================================
   Pradhan16 AI — Trading Journal
   Day 20: Journal + Review + Statistics
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


    // Calculate P/L
    const profitLoss =
        (exit - entry) * quantity;


    // Create trade object
    const trade = {

        symbol: symbol,

        entry: entry,

        exit: exit,

        quantity: quantity,

        profitLoss: profitLoss,

        date: new Date().toLocaleString()

    };


    // Get existing trades
    let trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    // Add new trade
    trades.push(trade);


    // Save trades
    localStorage.setItem(
        "pradhan16_trades",
        JSON.stringify(trades)
    );


    // Success message
    document.getElementById("tradeMessage").innerText =
        "✅ Trade saved successfully!";


    // Update Statistics immediately
    calculateStatistics();
}


/* =========================================
   OPEN TRADE REVIEW
   ========================================= */

function openReview() {

    const review =
        document.getElementById("review");

    const reviewMessage =
        document.getElementById("reviewMessage");


    // Get saved trades
    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    review.style.display = "block";


    // No trades
    if (trades.length === 0) {

        reviewMessage.innerText =
            "No saved trades found.";

        return;
    }


    // Trade history
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

        } else if (pl < 0) {

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


    // Get saved trades
    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );


    const totalTrades =
        trades.length;


    let winningTrades = 0;

    let losingTrades = 0;

    let grossProfit = 0;

    let grossLoss = 0;


    /* -----------------------------------------
       Calculate each trade
       ----------------------------------------- */

    trades.forEach(trade => {


        // IMPORTANT:
        // Saved trade field = profitLoss
        const pl =
            Number(trade.profitLoss) || 0;


        // Winning trade
        if (pl > 0) {

            winningTrades++;

            grossProfit += pl;

        }


        // Losing trade
        if (pl < 0) {

            losingTrades++;

            grossLoss += Math.abs(pl);

        }

    });


    /* -----------------------------------------
       Win Rate
       ----------------------------------------- */

    const winRate =

        totalTrades > 0

            ? (winningTrades / totalTrades) * 100

            : 0;


    /* -----------------------------------------
       Average Profit
       ----------------------------------------- */

    const averageProfit =

        winningTrades > 0

            ? grossProfit / winningTrades

            : 0;


    /* -----------------------------------------
       Average Loss
       ----------------------------------------- */

    const averageLoss =

        losingTrades > 0

            ? grossLoss / losingTrades

            : 0;


    /* -----------------------------------------
       Profit Factor
       ----------------------------------------- */

    const profitFactor =

        grossLoss > 0

            ? grossProfit / grossLoss

            : 0;


    /* -----------------------------------------
       Loss Rate
       ----------------------------------------- */

    const lossRate =

        totalTrades > 0

            ? losingTrades / totalTrades

            : 0;


    /* -----------------------------------------
       Expectancy
       ----------------------------------------- */

    const expectancy =

        (winRate / 100 * averageProfit)

        -

        (lossRate * averageLoss);


    /* =========================================
       DISPLAY STATISTICS
       ========================================= */


    // Total Trades
    const totalTradesElement =
        document.getElementById("totalTrades");

    if (totalTradesElement) {

        totalTradesElement.textContent =
            totalTrades;
    }


    // Winning Trades
    const winningTradesElement =
        document.getElementById("winningTrades");

    if (winningTradesElement) {

        winningTradesElement.textContent =
            winningTrades;
    }


    // Losing Trades
    const losingTradesElement =
        document.getElementById("losingTrades");

    if (losingTradesElement) {

        losingTradesElement.textContent =
            losingTrades;
    }


    // Win Rate
    const winRateElement =
        document.getElementById("winRate");

    if (winRateElement) {

        winRateElement.textContent =
            winRate.toFixed(2) + "%";
    }


    // Gross Profit
    const grossProfitElement =
        document.getElementById("grossProfit");

    if (grossProfitElement) {

        grossProfitElement.textContent =
            grossProfit.toFixed(2);
    }


    // Gross Loss
    const grossLossElement =
        document.getElementById("grossLoss");

    if (grossLossElement) {

        grossLossElement.textContent =
            grossLoss.toFixed(2);
    }


    // Average Profit
    const averageProfitElement =
        document.getElementById("averageProfit");

    if (averageProfitElement) {

        averageProfitElement.textContent =
            averageProfit.toFixed(2);
    }


    // Average Loss
    const averageLossElement =
        document.getElementById("averageLoss");

    if (averageLossElement) {

        averageLossElement.textContent =
            averageLoss.toFixed(2);
    }


    // Profit Factor
    const profitFactorElement =
        document.getElementById("profitFactor");

    if (profitFactorElement) {

        profitFactorElement.textContent =
            profitFactor.toFixed(2);
    }


    // Expectancy
    const expectancyElement =
        document.getElementById("expectancy");

    if (expectancyElement) {

        expectancyElement.textContent =
            expectancy.toFixed(2);
    }
}


/* =========================================
   RUN STATISTICS WHEN APP LOADS
   ========================================= */

calculateStatistics();
/* =========================================
   Pradhan16 AI — Day 21
   P/L Performance Chart
   ========================================= */

let plChart = null;

function createPLChart() {

    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    const canvas = document.getElementById("plChart");

    if (!canvas) {
        return;
    }

    const labels = trades.map((trade, index) =>
        "Trade " + (index + 1)
    );

    const profitLoss = trades.map(trade =>
        Number(trade.profitLoss) || 0
    );


    // Destroy old chart before creating new one
    if (plChart) {
        plChart.destroy();
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


/* Run chart when app loads */
createPLChart();