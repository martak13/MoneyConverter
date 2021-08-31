let PLZ, USD;
let table_exp =
    /<td class="mfm-text-nowrap" data-title="Середній курс" data-small="Купівля \/ Продаж">(.|\n|\r|\s)*?<\/td>/gm;
let currency_exp = /\d{1,2}\.\d{1,3}/gm;
let a = fetch("https://minfin.com.ua/ua/currency/banks/").then((res) => {
    res.text().then((html) => {
        let currency = html.match(table_exp);
        USD = parseFloat(currency[0].match(currency_exp)[3]);
        PLZ = parseFloat(currency[3].match(currency_exp)[3]);
    });
});

setInterval(() => {
    fetch("https://minfin.com.ua/ua/currency/banks/").then((res) => {
        res.text().then((html) => {
            let currency = html.match(table_exp);
            USD = parseFloat(currency[0].match(currency_exp)[3]);
            PLZ = parseFloat(currency[3].match(currency_exp)[3]);
        });
    });
}, 1000 * 3600 * 5);

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

function updateValues(key, value) {
    let uah = key == "UAH" ? value : key == "PLZ" ? value * PLZ : value * USD;
    let usd = uah / USD;
    let plz = uah / PLZ;
    let currencys = [uah, usd, plz];
    $(".option__input").each((i, elem) => {
        $(elem).val(financial(currencys[i]));
    });
}

$("#Convert").click(() => {
    let key = 1;
    $(".option__input").each((i, elem) => {
        if (elem.value && key) {
            updateValues(elem.placeholder, elem.value);
            key = 0;
        }
    });
});

$("#Clear").click(() => {
    $(".option__input").val("");
});
