campsites = []
availability = []
let selectedCampsite = ""
const KEY_NAME = "site"
const AVAILABILITY_KEY_NAME = "availability_key"

const getSiteInfo = () => {
    const siteNumber = JSON.parse(localStorage.getItem(KEY_NAME))
    const containerElement = document.querySelector("#site-info")
    containerElement.innerHTML = ""
    let availabilityNumber = ""
    for (let i = 0; i < campsites.length; i++) {
        const campsite = campsites[i]
        if (campsite.siteNumber === siteNumber) {
            selectedCampsite = campsite
            let hasPower = ""
            if (campsite.hasPower) hasPower=` class="bi bi-plug-fill"`
            let isPremium = ""
            if (campsite.isPremium) isPremium = ` class="bi bi-star-fill"`
            let isRadioFree = ""
            if (campsite.isRadioFree) isRadioFree = ` class="bi bi-broadcast"`
            for (let value of Object.values(availability)) {
                if (value.key === siteNumber) {
                    availabilityNumber = value.value
                }
            }
            containerElement.innerHTML += `
                <h3>1. SITE INFORMATION</h3>
                <p>Site: ${campsite.siteNumber}</p>
                <p>Equipment: ${campsite.equipment}</p> 
                <p>Features: 
                    <i ${hasPower}></i>
                    <i ${isPremium}></i> 
                    <i ${isRadioFree}></i>
                </p>
                <p>Availability: ${availabilityNumber} of 10 days</p>
            `
        }
    }
    const nightsElement = document.querySelector("#nights")
    nightsElement.options.length = 0
    for (let i = 1; i <= availabilityNumber; i++) {
        nightsElement.options.add(new Option(i, i))
    }
}

const reserveButtonPressed = () => {
    const name = document.querySelector("#name").value
    const email = document.querySelector("#email").value
    const nights = document.querySelector("#nights").value
    let nightlyRate = 47.50
    if (selectedCampsite.hasPower) nightlyRate = 52.50
    if (selectedCampsite.isPremium) nightlyRate = 57
    if (selectedCampsite.hasPower && selectedCampsite.isPremium) nightlyRate = 62

    const reservationId = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const subTotal = nights * nightlyRate
    const tax = subTotal * .13
    const total = subTotal + tax

    const reservationElement = document.querySelector("#receipt")
    reservationElement.innerHTML = `
    <div class="receipt-card">
        <p class="headline">Reservation #RES-${reservationId}</p>
        <p>Name: ${name} </p>
        <p>Email: ${email} </p>
        <p>Number of Nights: ${nights} </p>
        <p>Nightly Rate: $${nightlyRate} </p>
        <p>Subtotal: $${subTotal.toFixed(2)} </p>
        <p>Tax: $${tax.toFixed(2)} </p>
        <p>Total: $${total.toFixed(2)} </p>
    </div>
    `
    for (let value of Object.values(availability)) {
        if (value.key === selectedCampsite.siteNumber) {
            value.value -= nights
        }
    }
    localStorage.setItem(AVAILABILITY_KEY_NAME, JSON.stringify(availability))
}

fetch('./data.json')
.then(response => response.json())
.then(jsonData => {
    campsites = jsonData

    if (localStorage.hasOwnProperty(AVAILABILITY_KEY_NAME) === true) {
        availability = JSON.parse(localStorage.getItem(AVAILABILITY_KEY_NAME))
    } else {
        for (let i = 0; i < campsites.length; i++)
            availability.push({key: campsites[i].siteNumber, value: 5})
        localStorage.setItem(AVAILABILITY_KEY_NAME, JSON.stringify(availability))
    }
    
    getSiteInfo()
}).catch(error => console.log(error))