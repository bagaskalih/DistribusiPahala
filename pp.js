function scrapeMatKul() {
    var x = $("header[id=page-header]");
    var y = x[0].innerText;
    y = y.split("\n");
    let matkul = "";
    if (y.includes("[")) {
        const arr = y.split(" ");
        arr.pop();
        arr.pop();
        arr.forEach((element) => {
            matkul = matkul + element + " ";
        });
        matkul = matkul.trim();
    }
    return matkul;
}
