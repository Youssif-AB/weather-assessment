const express = require("express");

const cors = require("cors");

const db = require("./database");

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Weather backend is running");
});

app.get("/api/searches", (req, res) => {
    db.all(
        "SELECT * FROM searches ORDER BY created_at DESC",
        [],
        (err,rows) => {
            if (err) {
                res.status(500).json({error:err.message});
                return;
            }

            res.json(rows);
        }
    );
});

app.post("/api/searches", (req,res) => {
    const {location, temperature, description} = req.body;

    if (!location) {
        res.status(400).json({ error: "Location is required." });
        return;
    }

    db.run(
        `
        INSERT INTO searches (location, temperature, description)
        VALUES(?, ?, ?)
        `,
        [location, temperature, description],
        function (err) {
            if (err) {
                res.status(500).json({error: err.message})
            }
        

            res.status(201).json({
                id:this.lastID,
                location,
                temperature,
                description,
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
