$(function () {
    const ACCESS_CODE = "law227";
    const MAX_SCORE = 150;

    let scores = JSON.parse(localStorage.getItem("kidScores")) || {
        eliana: 0,
        ariel: 0,
        daniel: 0
    };

    function requireCode() {
        const input = prompt("Enter code to confirm score change:");
        return input !== null && $.trim(input) === ACCESS_CODE;
    }

    function updateDisplay() {
        $("#score-eliana").text(scores.eliana);
        $("#score-ariel").text(scores.ariel);
        $("#score-daniel").text(scores.daniel);

        $("#progress-eliana").css("width", Math.min((scores.eliana / MAX_SCORE) * 100, 100) + "%");
        $("#progress-ariel").css("width", Math.min((scores.ariel / MAX_SCORE) * 100, 100) + "%");
        $("#progress-daniel").css("width", Math.min((scores.daniel / MAX_SCORE) * 100, 100) + "%");

        reorderByScore();
    }

    function saveAndDisplay() {
        localStorage.setItem("kidScores", JSON.stringify(scores));
        updateDisplay();
    }

    function addPoints(kid, points) {
        if (!requireCode()) {
            return;
        }
        scores[kid] += points;
        saveAndDisplay();
        celebrate(kid);
    }

    function manualEdit(kid) {
        if (!requireCode()) {
            return;
        }
        const input = prompt(`Enter new score for ${kid}:`, scores[kid]);
        if (input !== null && !isNaN(input) && $.trim(input) !== "") {
            scores[kid] = parseInt(input, 10);
            saveAndDisplay();
        }
    }

    function resetScores() {
        if (!requireCode()) {
            return;
        }
        if (confirm("Are you sure you want to reset all scores?")) {
            scores = { eliana: 0, ariel: 0, daniel: 0 };
            saveAndDisplay();
        }
    }

    function reorderByScore() {
        const board = $("#scoreboard");
        const cards = [
            { kid: "eliana", score: scores.eliana },
            { kid: "ariel", score: scores.ariel },
            { kid: "daniel", score: scores.daniel }
        ];

        cards.sort((a, b) => b.score - a.score);

        $(".kid-card").removeClass("leader runner-up");
        cards.forEach((entry, index) => {
            const card = board.find(`.kid-card.${entry.kid}`);
            if (index === 0) {
                card.addClass("leader");
            } else if (index === 1) {
                card.addClass("runner-up");
            }
            board.append(card);
        });
    }

    function celebrate(kid) {
        const card = $(`.kid-card.${kid}`);
        card.css("transform", "scale(1.05)");
        setTimeout(() => card.css("transform", "scale(1)"), 200);
    }

    $(".scoreboard").on("click", "button[data-kid]", function () {
        const kid = $(this).data("kid");
        const points = parseInt($(this).data("points"), 10) || 0;
        addPoints(kid, points);
    });

    $(".scoreboard").on("click", ".kid-card", function (e) {
        if ($(e.target).closest("button").length > 0) {
            return;
        }
        const kid = $(this).data("kid");
        manualEdit(kid);
    });

    $("#reset-btn").on("click", resetScores);

    updateDisplay();
});
