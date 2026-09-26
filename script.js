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