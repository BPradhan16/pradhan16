/* =========================================
   Pradhan16 AI — Trading Journal
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

    // Save trade in browser
    localStorage.setItem(
        "pradhan16_trade",
        JSON.stringify(trade)
    );

    document.getElementById("tradeMessage").innerText =
        "✅ Trade saved successfully!";
}


// Open Trade Review
function openReview() {

    const review = document.getElementById("review");
    const reviewMessage = document.getElementById("reviewMessage");

    const savedTrade =
        localStorage.getItem("pradhan16_trade");

    review.style.display = "block";

    if (!savedTrade) {

        reviewMessage.innerText =
            "No saved trade found.";

        return;
    }

    const trade = JSON.parse(savedTrade);

    reviewMessage.innerHTML = `
        <strong>Symbol:</strong> ${trade.symbol}<br>
        <strong>Entry:</strong> ₹${trade.entry}<br>
        <strong>Exit:</strong> ₹${trade.exit}<br>
        <strong>Quantity:</strong> ${trade.quantity}<br>
        <strong>P/L:</strong> ₹${trade.profitLoss.toFixed(2)}<br>
        <strong>Date:</strong> ${trade.date}
    `;
}
