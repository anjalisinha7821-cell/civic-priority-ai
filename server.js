const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Analyze multiple civic problems
app.post("/api/analyze", (req, res) => {
    try {
        const { problems } = req.body;

        if (!problems || problems.length === 0) {
            return res.status(400).json({
                error: "Please add at least one problem."
            });
        }

        const analyzedProblems = problems.map((problem) => {

            const severity = Number(problem.severity);
            const impact = Number(problem.impact);
            const frequency = Number(problem.frequency);
            const urgency = Number(problem.urgency);

            // Priority formula
            const priorityScore = Math.round(
                (severity * 0.35) +
                (impact * 0.25) +
                (frequency * 0.20) +
                (urgency * 0.20)
            );

            // Priority level
            let priorityLevel;

            if (priorityScore >= 80) {
                priorityLevel = "Critical";
            } else if (priorityScore >= 60) {
                priorityLevel = "High";
            } else if (priorityScore >= 40) {
                priorityLevel = "Medium";
            } else {
                priorityLevel = "Low";
            }

            // Detect problem type
            const text = problem.description.toLowerCase();

            let problemType = "General Civic Issue";
            let authority = "Municipal Corporation";
            let action = "Inspect the location and take appropriate action.";

            if (
                text.includes("pothole") ||
                text.includes("road") ||
                text.includes("street")
            ) {
                problemType = "Road / Pothole";
                authority = "Public Works Department";
                action = "Inspect and repair the damaged road.";
            }

            else if (
                text.includes("garbage") ||
                text.includes("waste") ||
                text.includes("trash")
            ) {
                problemType = "Garbage / Waste";
                authority = "Sanitation Department";
                action = "Arrange waste collection and clean the area.";
            }

            else if (
                text.includes("water") ||
                text.includes("leakage") ||
                text.includes("pipeline")
            ) {
                problemType = "Water Supply";
                authority = "Water Supply Department";
                action = "Inspect the pipeline and repair the leakage.";
            }

            else if (
                text.includes("streetlight") ||
                text.includes("street light") ||
                text.includes("lamp")
            ) {
                problemType = "Street Light";
                authority = "Electrical Department";
                action = "Inspect and repair the street light.";
            }

            else if (
                text.includes("drain") ||
                text.includes("sewage") ||
                text.includes("sewer")
            ) {
                problemType = "Drainage / Sewage";
                authority = "Drainage Department";
                action = "Inspect and clear the drainage system.";
            }

            return {
                description: problem.description,
                severity,
                impact,
                frequency,
                urgency,
                priorityScore,
                priorityLevel,
                problemType,
                authority,
                action
            };
        });

        // Sort highest priority first
        analyzedProblems.sort(
            (a, b) => b.priorityScore - a.priorityScore
        );

        // Add ranking
        analyzedProblems.forEach((problem, index) => {
            problem.rank = index + 1;
        });

        res.json({
            success: true,
            problems: analyzedProblems
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Analysis failed."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});