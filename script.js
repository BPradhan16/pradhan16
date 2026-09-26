/* =========================================
   Pradhan16 AI — Trading Journal
   Day 18: Multiple Trades + LocalStorage
   ========================================= */

// Open Trading Journal
function openJournal() {
    document.getElementById("journal").style.display = "block";
}


// Calculate Profit / Loss
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


// Save Trade
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

    // Get existing trades
    let trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    // Add new trade
    trades.push(trade);

    // Save all trades
    localStorage.setItem(
        "pradhan16_trades",
        JSON.stringify(trades)
    );

    document.getElementById("tradeMessage").innerText =
        "✅ Trade saved successfully!";
}


// Open Trade Review
function openReview() {

    const review = document.getElementById("review");
    const reviewMessage = document.getElementById("reviewMessage");

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
                P/L: ₹${trade.profitLoss.toFixed(2)}<br>
                Date: ${trade.date}
                <hr>
            </div>
        `;
    });

    reviewMessage.innerHTML = html;
}
// ================================
// DAY 19 — TRADE STATISTICS
// ================================

function getTradeStats() {
    const trades = JSON.parse(
        localStorage.getItem("pradhan16_trades") || "[]"
    );

    let totalPL = 0;
    let wins = 0;
    let losses = 0;

    trades.forEach(trade => {
        const pl = Number(trade.pl || 0);

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
   Pradhan16 AI — Trading Statistics
   Day 20: Statistics Engine
   ========================================= */

function calculateStatistics() {

    const totalTrades = trades.length;

    let winningTrades = 0;
    let losingTrades = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    trades.forEach(trade => {

        const pl = Number(trade.pl) || 0;

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
        (winRate / 100 * averageProfit) -
        (lossRate * averageLoss);

    document.getElementById("totalTrades").textContent =
        totalTrades;

    document.getElementById("winningTrades").textContent =
        winningTrades;

    document.getElementById("losingTrades").textContent =
        losingTrades;

    document.getElementById("winRate").textContent =
        winRate.toFixed(2) + "%";

    document.getElementById("grossProfit").textContent =
        grossProfit.toFixed(2);

    document.getElementById("grossLoss").textContent =
        grossLoss.toFixed(2);

    document.getElementById("averageProfit").textContent =
        averageProfit.toFixed(2);

    document.getElementById("averageLoss").textContent =
        averageLoss.toFixed(2);

    document.getElementById("profitFactor").textContent =
        profitFactor.toFixed(2);

    document.getElementById("expectancy").textContent =
        expectancy.toFixed(2);
}


/* Update statistics whenever page loads */
calculateStatistics();