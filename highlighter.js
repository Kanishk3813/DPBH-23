var fileUrl = chrome.runtime.getURL('dataset.txt');
console.log(fileUrl);
fetch(fileUrl)
    .then(response => response.text())
    .then(content => {
        const patterns = content.split('\n').filter(Boolean).map(pattern => pattern.trim());
        var bodyText = document.body.innerHTML;
        var matchCounter = 0;

        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i].trim();

            var patternClass = "";
            var tooltipTitle = "";

            if (pattern.includes("Only left in stock.")) {
                patternClass = "only-left-class";
                tooltipTitle = "Urgency: Places deadlines on things to make them appear more desirable";
            } else if (pattern.includes("in stock") || pattern.includes("claimed")) {
                patternClass = "in-stock-class";
                tooltipTitle = "Scarcity: Tries to increase the value of something by making it appear to be limited in availability";
            } else if (pattern.includes("Ends") && pattern.includes("in") || pattern.includes("Order within") || pattern.includes("Deal of the day")){
                patternClass = "ends-class";
                tooltipTitle = "Urgency: Places deadlines on things to make them appear more desirable";
            } else if (pattern.includes("bought in past month") || pattern.includes("Frequently bought together")) {
                patternClass = "last-class";
                tooltipTitle = "Social Proof: Gives the perception that a given action or product has been approved by other people";
            } else if (pattern.includes("Bestseller") || pattern.includes("Best Seller") || pattern.includes("Best-selling")) {
                patternClass = "best-class";
                tooltipTitle = "Misdirection: Aims to deceptively incline a user towards one choice over the other";
            } else if (pattern.includes("With Exchange") || pattern.includes("Add a Protection Plan") || pattern.includes("No Cost EMI") || pattern.includes("3 months Prime membership")){
                patternClass = "exchange-class";
                tooltipTitle = "Sneaking: Coerces users to act in ways that they would not normally act by obscuring information";
            }

            var regex = new RegExp(`(?<!["'])\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!>)`, 'gi');

            bodyText = bodyText.replace(regex, function (match) {
                matchCounter++;
                return `<span class="${patternClass}" title="${tooltipTitle}" data-toggle="tooltip" data-placement="top" data-original-title="${pattern}" style="background-color: yellow;">${match}</span>`;
            });
        }

        sendMatchCounter(matchCounter);

        document.body.innerHTML = bodyText;

        // Enable tooltips using Bootstrap
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });

function sendMatchCounter(counter) {
    chrome.runtime.sendMessage({ action: 'sendMatchCounter', matchCounter: counter });
}