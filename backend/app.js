const mysql = require("mysql");
const express = require("express");
const app = express();
const port = 3000;

const pool = mysql.createPool({
    connectionLimit: 200,
    host: "localhost",
    user: "membantu_admin",
    password: "bagaskp0704",
    database: "membantu_kaje",
    multipleStatements: true,
});

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/request", function (req, res) {
    const matkul = req.query.matkul;
    const soal = req.query.soal;

    const query = "SELECT * FROM `" + matkul + "` WHERE soal = '" + soal + "'";

    pool.query(query, function (err, rows, fields) {
        if (!err) {
            res.send({
                rows,
            });
        } else {
            res.send(err);
        }
    });
});

app.get("/api/create", function (req, res) {
    // create table
    const matkul = req.query.matkul;

    function addtable(matkul) {
        const que = "CREATE TABLE IF NOT EXISTS `" + matkul + "` ( id INT(11) AUTO_INCREMENT PRIMARY KEY, soal VARCHAR(320) NOT NULL, jawaban VARCHAR(320) NOT NULL, sumber VARCHAR(320) NOT NULL)";
        pool.query(que, function (err, result) {
            if (!err) {
                res.send({
                    result: "Table created successfully",
                });
            }
        });
    }

    function checktable(matkul, callback) {
        const query = "SHOW TABLES LIKE '" + matkul + "'";
        pool.query(query, function (err, result) {
            if (!err) {
                if (result.length === 0) {
                    callback(matkul);
                } else {
                    res.send({ result: "Table available." });
                }
            }
        });
    }

    checktable(matkul, addtable);
});

app.post("/api/send", function (req, res) {
    const matkul = req.body.matkul;
    const soal = req.body.soal;
    const jawaban = req.body.jawaban;
    const sumber = req.body.sumber;

    function checkRow(matkul, soal, jawaban, sumber, callback1, callback2) {
        // Callback 1 to insert row, callback 2 to alter row
        const query = "SELECT * FROM `" + matkul + "` WHERE soal = '" + soal + "' AND sumber = '" + sumber + "'";
        pool.query(query, function (err, result) {
            if (result.length === 0) {
                callback1(matkul, soal, jawaban, sumber);
            } else {
                callback2(matkul, soal, jawaban, sumber);
            }
        });
    }
    function alterRow(matkul, soal, jawaban, sumber) {
        const que = "UPDATE `" + matkul + "` SET jawaban = '" + jawaban + "' WHERE soal = '" + soal + "' AND sumber = '" + sumber + "'";
        pool.query(que, function (err, result) {
            if (!err) {
                res.send({
                    result: "Update successful.",
                });
            }
        });
    }
    function insertRow(matkul, soal, jawaban, sumber) {
        const quer = "INSERT INTO `" + matkul + "` (soal,jawaban,sumber) VALUES ('" + soal + "', '" + jawaban + "', '" + sumber + "')";

        pool.query(quer, function (err, result) {
            if (!err) {
                res.send({
                    result: "Insert successful.",
                });
            }
        });
    }

    checkRow(matkul, soal, jawaban, sumber, insertRow, alterRow);
});

app.post("/api/user", function (req, res) {
    const user = req.body.user;

    function checkRow(user, callback1) {
        // Callback 1 to insert row, callback 2 to alter row
        const query = "SELECT * FROM `users` WHERE user = '" + user + "'";
        pool.query(query, function (err, result) {
            if (result.length === 0) {
                callback1(user);
            }
        });
    }
    function insertRow(user) {
        const quer = "INSERT INTO `users` (user) VALUES ('" + user + "')";

        pool.query(quer, function (err, result) {
            if (!err) {
                res.send({
                    result: "Insert successful.",
                });
            }
        });
    }

    checkRow(user, insertRow);
});
