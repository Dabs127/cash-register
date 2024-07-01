let price = 1.87;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE",90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
]
const cidValues = [
    0.01,
    0.05,
    0.1,
    0.25,
    1,
    5,
    10,
    20,
    100
]
const imagesForDrawer = {
    "PENNY": {
        filename: "penny.png",
        valueFor1Image: cid[0][1] / 6,
        type: "coin"
    },
    "NICKEL": {
        filename: "nickel.png",
        valueFor1Image: cid[1][1] / 6,
        type: "coin"
    },
    "DIME": {
        filename: "dime.png",
        valueFor1Image: cid[2][1] / 6,
        type: "coin"
    },
    "QUARTER": {
        filename: "quarter.png",
        valueFor1Image: cid[3][1] / 6,
        type: "coin"
    },
    "ONE": {
        filename: "oneDollar.jpg",
        valueFor1Image: cid[4][1] / 6,
        type: "bill"
    },
    "FIVE": {
        filename: "fiveDollar.jpg",
        valueFor1Image: cid[5][1] / 6,
        type: "bill"
    },
    "TEN": {
        filename: "tenDollar.jpg",
        valueFor1Image: cid[6][1] / 6,
        type: "bill"
    },
    "TWENTY": {
        filename: "twentyDollar.jpg",
        valueFor1Image: cid[7][1] / 6,
        type: "bill"
    },
    "ONE HUNDRED": {
        filename: "onehundredDollar.jpg",
        valueFor1Image: cid[8][1] / 6,
        type: "bill"
    },
}

const cashInput = document.getElementById("cash")
const purchaseBtn = document.getElementById("purchase-btn")
const changedueParagraph = document.getElementById("change-due")
const changeSpans = document.querySelectorAll("#change-in-drawer span")
const divDrawers = document.querySelectorAll(".drawer-container .images-container");
const totalPriceParagraph = document.getElementById("total-price")
let isNotEnoughFounds = false

changeSpans.forEach((span, index) => {
    span.textContent += cid[index][1];
})
totalPriceParagraph.textContent = `$ ${price}`

purchaseBtn.addEventListener("click", () => {
    const cash = parseFloat(cashInput.value);
    const changeDue = parseFloat((cash - price).toFixed(2));
    const totalInDrawer = parseFloat(cid.reduce((acc, typeOfCash) => typeOfCash[1] + acc, 0).toFixed(2));

    if(changeDue < 0 || isNaN(changeDue)) {
        alert("Customer does not have enough money to purchase the item")
        return
    }

    fundsComparative(changeDue, totalInDrawer);
})

const updateChanges = () => {
    changeSpans.forEach((span, index) => {
        span.textContent = span.textContent.replace(/(-*)?\d+(\.)?\d+/g , cid[index][1].toFixed(2));
        span.textContent = span.textContent.replace(/(-+)/g , "");
    })
}

const updateStatus = () => {
    changedueParagraph.textContent = ""
}

const fundsComparative = (changeDue, cashInDrawer) => {

    // Diferentes situaciones, ejemplo: Mas dinero en la caja que el cambio a dar
    if(cashInDrawer > changeDue){
        moreCashInDrawer(changeDue)
        return
    }
    if(cashInDrawer < changeDue) {
        lessCashInDrawer()
        return
    } 

    if(parseFloat(changeDue) === parseFloat(cashInDrawer)){
        equalCashInDrawer(changeDue)
        return
    }

    if(parseFloat(changeDue) === 0) {
        exactCash()
        return
    }
}
    
const moreCashInDrawer = (changeDue) => {

    let moneyUsed = {}
    let cidCopy = cid

    for(let i = cidCopy.length - 1; i > -1; i--){
        //Si el tipo de moneda es mayor que el cambio total no utilizar como cambio
        if(changeDue < cidValues[i]){
            continue;
        }

        // settear las keys del objeto
        moneyUsed[cidCopy[i][0]] = 0
    }

    console.log(moneyUsed)

    let restingMoney = 0

    for(let [key, value] of cid) {
        //console.log(key, moneyUsed)
        if(key in moneyUsed){
            restingMoney += value
        }
    }

    console.log(restingMoney, changeDue)
    if(restingMoney < changeDue){
        lessCashInDrawer()
        console.log(cid)
        return
    }

    for(let i = cidCopy.length - 1; i > -1; i--){

        //
        while(changeDue - cidValues[i] >= 0){

            // Si se nos acaba este tipo de moneda, borrarlo de dinero usado y romper el ciclo
            if(cid[i][1] <= 0 ){
                break;
            }

            cidCopy[i][1] -= cidValues[i]
            changeDue -= cidValues[i]
            moneyUsed[cidCopy[i][0]] += cidValues[i]

            if(changeDue > 0 && changeDue < 0.01){
                moneyUsed[cidCopy[i][0]] += cidValues[i]
                changeDue = Math.round(changeDue)
            }
        }



        printImages(cid[i][0], cid[i][1])
    }

    if(changeDue != 0){
        lessCashInDrawer()
        return
    }

    //console.log(cid)

    cid = cidCopy
    updateStatus();
    updateChanges();

    //console.log(cid)

    changedueParagraph.textContent += `
        Status: OPEN
    `

    //console.log(moneyUsed)
    for(let key in moneyUsed) {
        changedueParagraph.textContent += `${key}: $${moneyUsed[key]}\r\n`
    }

    // console.log(changeDue.toFixed(2))
    // console.log(cid)
}


const equalCashInDrawer = (changeDue) => {
    
    let moneyUsed = {}
    let cidCopy = cid

    for(let i = cidCopy.length - 1; i > -1; i--){
        
        //Si el tipo de moneda es mayor que el cambio total no utilizar como cambio
        if(changeDue < cidValues[i]){
            continue;
        }

        if(cid[i][1] === 0) {
            continue
        }

        // settear las keys del objeto
        moneyUsed[cidCopy[i][0]] = 0
    
        //
        while(changeDue - cidValues[i] >= 0){


            // Si se nos acaba este tipo de moneda, borrarlo de dinero usado y romper el ciclo
            if(cid[i][1] <= 0 ){
                //delete moneyUsed[cidCopy[i][0]]
                break;
            }

            cidCopy[i][1] -= cidValues[i]
            changeDue -= cidValues[i]
            moneyUsed[cidCopy[i][0]] += cidValues[i]
            if(changeDue > 0 && changeDue < 0.01){
                moneyUsed[cidCopy[i][0]] += cidValues[i]
                changeDue = Math.round(changeDue)
            }
        }
        printImages();
    }

    cid = cidCopy
    updateStatus();
    updateChanges();

    //console.log(moneyUsed)

    changedueParagraph.textContent += `
        Status: CLOSED
    `

    for(let key in moneyUsed) {
        moneyUsed[key] = parseFloat(moneyUsed[key]).toPrecision(2)
        changedueParagraph.textContent += `${key}: $${moneyUsed[key]}\r\n`
    }
}

const exactCash = () => {
    updateStatus();
    changedueParagraph.textContent = "No change due - customer paid with exact cash";
};


const lessCashInDrawer = () => {

    updateStatus();
    updateChanges();
    changedueParagraph.textContent += "Status: INSUFFICIENT_FUNDS"
}

const printImages = (coinName, moneyLeft) => {

    const drawer = Array.from(divDrawers).find((drawer) => drawer.dataset.coinname === coinName);
    const {type, valueFor1Image, filename} = imagesForDrawer[coinName]

    if(moneyLeft < valueFor1Image * 6 && moneyLeft >= valueFor1Image * 5) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft < valueFor1Image * 5 && moneyLeft >= valueFor1Image * 4) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft < valueFor1Image * 4 && moneyLeft >= valueFor1Image * 3) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft < valueFor1Image * 3 && moneyLeft >= valueFor1Image * 2) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft < valueFor1Image * 2 && moneyLeft >= valueFor1Image) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft < valueFor1Image && moneyLeft > 0) {
        drawer.innerHTML = `
            <img class="${type}" src="img/${filename}" alt="${coinName} Image">
        ` 
        return
    }
    if(moneyLeft <= 0) {
        drawer.innerHTML = `` 
        return
    }
}