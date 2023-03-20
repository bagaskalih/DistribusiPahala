// ==UserScript==
// @name        Internet Booster
// @namespace   Violentmonkey Scripts
// @match       https://lms.telkomuniversity.ac.id/*
// @match       file:///C:/Users/Lenovo/Downloads/New%20folder/pop%20quiz%20Minggu%201%20(page%201%20of%2010).html
// @match       file:///C:/Users/Lenovo/Documents/Coding/zxzx/kjKuisTelU/New%20folder/KUIS-1%20Konversi%20Basis%20Bilangan%20(page%205%20of%2014).html
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      shiba inu
// @require     http://code.jquery.com/jquery-latest.js
// @description 2/2/2023, 10:44:03 PM
// @license     MIT
// ==/UserScript==
// credit to mas feb & tim fuckoffline

const NAME = "input nama anon";

function scrapeJawaban() {
    var x = $("input[type=radio][checked]");

    var y = x[0].nextElementSibling;

    if (y.innerText.includes("A.") || y.innerText.includes("a.") || y.innerText.includes("B.") || y.innerText.includes("b.") || y.innerText.includes("C.") || y.innerText.includes("c.") || y.innerText.includes("D.") || y.innerText.includes("d.") || y.innerText.includes("E.") || y.innerText.includes("e.")) {
        var pil = y.innerText.split(".");
        pil[1] = pil[1].trim();
        return pil[1];
    } else {
        return y.innerText;
    }
}

function scrapeEsai() {
    var x = $("input[type=text]");
    var y = x[1].value;
    return y;
}

function comparePilihan(jawaban) {
    var x = $("input[type=radio]");
    console.log("comparePilihan");

    for (var i = 0; i < x.length; i++) {
        var pilihan = x[i];
        var pilihanText = pilihan.nextElementSibling.innerText;
        if (pilihanText.includes("A.") || pilihanText.includes("a.") || pilihanText.includes("B.") || pilihanText.includes("b.") || pilihanText.includes("C.") || pilihanText.includes("c.") || pilihanText.includes("D.") || pilihanText.includes("d.") || pilihanText.includes("E.") || pilihanText.includes("e.")) {
            pilihanText = pilihanText.split(".");
            pilihanText[1] = pilihanText[1].trim();
            if (pilihanText[1] == jawaban) {
                return pilihanText[0];
            }
        } else {
            return jawaban;
        }
    }
}

function scrapeSoal() {
    var x = $("div[class=qtext]");

    var y = x[0].innerText;

    return y;
}

function scrapeMatKul() {
    var x = $("header[id=page-header]");
    var y = x[0].innerText;
    y = y.split("\n");
    let matkul = "";

    if (y[0].includes("[")) {
        const arr = y[0].split(" ");
        arr.pop();
        arr.pop();
        arr.forEach((element) => {
            matkul = matkul + element + " ";
        });
        matkul = matkul.trim();
    }

    return matkul;
}

function scrapeUser() {
    var x = $("div[class=logininfo]");
    return x[0].childNodes[1].text;
}

function jawab(ans) {
    var lstPilihan = $("input[type=radio]");

    for (var i = 0; i < lstPilihan.length; i++) {
        var pilihan = lstPilihan[i];
        var pilihanText = pilihan.nextElementSibling.innerText;
        pilihanText = pilihanText.split(".");
        pilihanText[1] = pilihanText[1].trim();
        if (pilihanText[1] == ans) {
            pilihan.click();
            break;
        }
    }
}

let keysPressed = {};
var kj = "";
let jawaban = "";
var address = $("span:contains('Gedung Panehan Pasca Sarjana')")[0];
var realAddress = "Gedung Panehan Pasca Sarjana\n                                                Lantai 1,<br>";
let message = "";

document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;

    if (keysPressed["z"] && event.key == "x") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://membantuipk4.my.id/api/user",
            data: "&user=" + scrapeUser(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://membantuipk4.my.id/api/request?matkul=" + scrapeMatKul() + "&soal=" + scrapeSoal(),
            onload: function (response) {
                var allAns = "";
                var list = response.responseText.slice();
                list = list.slice(8);
                list = list.slice(0, list.length - 1);
                list = JSON.parse(list);
                console.log(response);

                for (var i = 0; i < list.length; i++) {
                    allAns = allAns + list[i].sumber + " : " + comparePilihan(list[i].jawaban) + "<br>";
                }
                address.innerHTML = allAns;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed["x"] && event.key == "z") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://membantuipk4.my.id/api/user",
            data: "&user=" + scrapeUser(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://membantuipk4.my.id/api/request?matkul=" + scrapeMatKul() + "&soal=" + scrapeSoal(),
            onload: function (response) {
                var allAns = "";
                var list = response.responseText.slice();
                list = list.slice(8);
                list = list.slice(0, list.length - 1);
                list = JSON.parse(list);
                for (var i = 0; i < list.length; i++) {
                    allAns = allAns + list[i].sumber + " : " + comparePilihan(list[i].jawaban) + "<br>";
                }
                address.innerHTML = allAns;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed["s"] && event.key === "a") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://membantuipk4.my.id/api/send",
            data: "matkul=" + scrapeMatKul() + "&soal=" + scrapeSoal() + "&jawaban=" + scrapeJawaban() + "&sumber=" + NAME,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function (response) {
                if (response.responseText === '{"result":"Update successful."}') {
                    message = "jawaban berhasil diupdate <br>";
                } else {
                    message = "jawaban berhasil ditambahkan <br>";
                }
                address.innerHTML = message;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed["a"] && event.key === "s") {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://membantuipk4.my.id/api/send",
            data: "matkul=" + scrapeMatKul() + "&soal=" + scrapeSoal() + "&jawaban=" + scrapeJawaban() + "&sumber=" + NAME,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function (response) {
                if (response.responseText === '{"result":"Update successful."}') {
                    message = "jawaban berhasil diupdate <br>";
                } else {
                    message = "jawaban berhasil ditambahkan <br>";
                }
                address.innerHTML = message;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed["q"] && event.key === "w") {
        console.log(scrapeSoal());
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://membantuipk4.my.id/api/send",
            data: "matkul=" + scrapeMatKul() + "&soal=" + scrapeSoal() + "&jawaban=" + scrapeEsai() + "&sumber=" + NAME,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function (response) {
                if (response.responseText === '{"result":"Update successful."}') {
                    message = "jawaban berhasil diupdate <br>";
                } else {
                    message = "jawaban berhasil ditambahkan <br>";
                }
                address.innerHTML = message;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed[","] && event.key === ".") {
        // create table if not exist

        let message = "";
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://membantuipk4.my.id/api/create?matkul=" + scrapeMatKul(),
            onload: function (response) {
                if (response.responseText === '{"result":"Table available."}') {
                    message = "udah ada yg buat <br>";
                } else {
                    message = "table created <br>";
                }
                address.innerHTML = message;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (keysPressed["."] && event.key === ",") {
        let message = "";

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://membantuipk4.my.id/api/create?matkul=" + scrapeMatKul(),
            onload: function (response) {
                if (response.responseText === '{"result":"Table available."}') {
                    message = "udah ada yg buat <br>";
                } else {
                    message = "table created <br>";
                }
                address.innerHTML = message;
                setTimeout(function () {
                    address.innerHTML = realAddress;
                }, 1800);
            },
        });
    } else if (event.key === "b") {
        console.log(scrapeMatKul());
    } else if (event.key === "n") {
        scrapeEsai();
    }
});

document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
});
