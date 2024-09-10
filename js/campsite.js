campsites = []
availability = []
const KEY_NAME = "site"
const AVAILABILITY_KEY_NAME = "availability_key"

const displaySite = (result) => {
    containerElement = document.querySelector("#sites")
    containerElement.innerHTML = ""
    for (let i = 0; i < result.length; i++) {
        const campsite = result[i]
        
        let hasPower = ""
        if (campsite.hasPower) hasPower=` class="bi bi-plug-fill"`

        let isPremium = ""
        if (campsite.isPremium) isPremium = ` class="bi bi-star-fill"`

        let isRadioFree = ""
        if (campsite.isRadioFree) isRadioFree = ` class="bi bi-broadcast"`

        let availabilityElement = ""
        for (let avail of availability) {
            if (avail.key === campsite.siteNumber) {
                for (let k = 0; k < 10; k++) {
                    if (k < avail.value)
                        availabilityElement += `<i class="bi bi-circle green"></i> `
                    else 
                        availabilityElement += `<i class="bi bi-x-circle red"></i> `
                }
            }
        }  

        containerElement.innerHTML += `
            <div class="site-card">
                <div>
                    <img src="${campsite.image}"/>
                </div>
                <div>
                    <p><b>Site ${campsite.siteNumber}</b></p>
                    <p>Equipment: ${campsite.equipment}</p>
                    <p>AVAILABILITY:</p>
                    ${availabilityElement}
                    <p>Site Features:</p>
                    <i ${hasPower}></i>
                    <i ${isPremium}></i> 
                    <i ${isRadioFree}></i>
                </div>
                <div>
                    <button onclick="bookButtonPressed(${campsite.siteNumber})">Book Site</button>
                </div>
            </div>
        `
    }
}

const dropDownChanged = (elem) => {
    if (elem.target.id === "equipment") {
        const result = []
        const selectedType = document.querySelector("#equipment").value
        if (selectedType === "Show All") {
            displaySite(campsites)
            return
        }
        for (let i = 0; i < campsites.length; i++) {
            const campsite = campsites[i]
            if (campsite.equipment.some(elem => elem === selectedType)) {
                result.push(campsite)
            }
        }
        displaySite(result)
        return
    }

    if(elem.target.id === "nights") {
        const result = []
        const selectedType = document.querySelector("#nights").value
        for (let i = 0; i < campsites.length; i++) {
            const campsite = campsites[i]
            if (availability[i].value >= selectedType) {
                result.push(campsite)
            }
        }
        displaySite(result)
        return
    }
}

const bookButtonPressed = (siteNumber) => {
    localStorage.setItem(KEY_NAME, JSON.stringify(siteNumber))
    window.location.href = "payment.html"
}

fetch('./data.json')
.then(response => response.json())
.then(jsonData => {
    campsites = jsonData
    if (localStorage.hasOwnProperty(AVAILABILITY_KEY_NAME) === true) {
        availability = JSON.parse(localStorage.getItem(AVAILABILITY_KEY_NAME))
    } else {
        for (let i = 0; i < campsites.length; i++)
            availability.push({key: campsites[i].siteNumber, value: 10})
        localStorage.setItem(AVAILABILITY_KEY_NAME, JSON.stringify(availability))
    }
    displaySite(campsites)
}).catch(error => console.log(error))

document.querySelector("#equipment").addEventListener("change", dropDownChanged)
document.querySelector("#nights").addEventListener("change", dropDownChanged)