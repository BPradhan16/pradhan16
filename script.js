function openJournal() {
    document.getElementById("journal").style.display = "block";
}

function saveTrade() {
    const symbol = document.getElementById("symbol").value;
    const entry = document.getElementById("entry").value;
    const exit = document.getElementById("exit").value;

    const trade = {
        symbol: symbol,
        entry: entry,
        exit: exit
    };

    localStorage.setItem("pradhan16_trade", JSON.stringify(trade));

    document.getElementById("tradeMessage").innerText =
        "Trade saved successfully!";
}