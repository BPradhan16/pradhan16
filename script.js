function openJournal() {
    document.getElementById("journal").style.display = "block";
}

function saveTrade() {
    const symbol = document.getElementById("symbol").value;
    const entry = document.getElementById("entry").value;
    const exit = document.getElementById("exit").value;

    document.getElementById("tradeMessage").innerText =
        "Trade saved: " + symbol + " | Entry: " + entry + " | Exit: " + exit;
}