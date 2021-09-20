window.addEventListener('load', loadCountries)


function changeMode(){
    let body = document.body
    body.classList.toggle("dark-mode")
}

async function getCountries(){
    try{
        let response = await fetch("https://restcountries.eu/rest/v2/all")
        let countries = await response.json()
        return countries
    } catch (error){
        console.log(error)
    }
}

async function loadCountries(){
    let countries = await getCountries()
    createCountries(countries)
}

function createCountries(countries){
    let container = document.getElementById('countries-container')
    container.innerHTML = ""
    
    countries.forEach(country =>{
        let newCountry = `
        <div  class='country-card'>
            <img src=${country.flag} class='country-flag'>
            <div class='country-info-container'>
                <h2 class='country-name'><a href="#" onclick="createCountryDetail(event)">${country.name}</a></h2>
                <p class='country-info'>Population: <span>${country.population}</span></p>
                <p class='country-info'>Region: <span class="region">${country.region}</span></p>
                <p class='country-info'>Capital: <span>${country.capital}</span></p>
            </div>
        </div>
        `
        container.innerHTML += newCountry
    })

}

async function regionFilter(event){
    let countries = await getCountries()
    if(event.target.value != "all"){
        let filteredCountries = countries.filter(country => country.region === event.target.value)
        createCountries(filteredCountries)
    }else{
        createCountries(countries)
    }
}

async function inputFilter(event){
    let btn = document.getElementById("clear-input-btn")
    btn.style.display = "block"
    if(event.keyCode === 13){
        let countries = await getCountries()
        await countries.forEach(country => {
            if(country.name == event.target.value){
                let filteredCountry = [country]
                createCountries(filteredCountry)
            }
        })
    }
}

async function clearSearch(){
    let btn = document.getElementById("clear-input-btn")
    let input = document.getElementById("filter-input")

    btn.style.display = "none"
    input.value = ""

    let countries = await getCountries()
    createCountries(countries)
}

async function createCountryDetail(event){
    let countries = await getCountries()
    try{
        let response = await fetch("https://restcountries.eu/rest/v2/name/" + event.target.innerHTML.toLowerCase())
        countryDetail = await response.json()

        //change the sections display
        let countriesContainer = document.getElementById("countries-section")
        let detailSection = document.getElementById("detail-section")
        let cardContainer = document.getElementById('country-detail-container')

        detailSection.style.display = "block"
        countriesContainer.style.display = "none"

        //get the name of the border countries from the code
        let borders = countryDetail[0].borders
        let bordersNames = []

        borders.forEach(border =>{
            countries.forEach(country =>{
                if(country.alpha3Code == border){
                    bordersNames.push(" " + country.name)
                }
            })
        })

        let countryCard = `
                <img src="${countryDetail[0].flag}" id="country-detail-img" alt="">
                    
                <div class='country-detail-info-container'>
                    <div id='country-detail-title-container'>
                        <h1 id='country-detail-title'>${countryDetail[0].name}</h1>
                    </div>  
                    <div id='country-detail-info'>
                        <div class='country-detail-info-col-1'>
                            <p class='country-detail-info-item'>Native Name: <span id='native-name'>${countryDetail[0].name}</span></p>
                            <p class='country-detail-info-item'>Population: <span id='population'>${countryDetail[0].population}</span></p>
                            <p class='country-detail-info-item'>Region: <span id='region'>${countryDetail[0].region}</span></p>
                            <p class='country-detail-info-item'>Sub Region: <span id='sub-region'>${countryDetail[0].subregion}</span></p>
                            <p class='country-detail-info-item'>Capital: <span id='capital'>${countryDetail[0].capital}</span></p>
                        </div>
                        <div class='country-detail-info-col-2'>
                            <p class='country-detail-info-item'>Top Level Domain: <span id='domain'>${countryDetail[0].topLevelDomain}</span></p>
                            <p class='country-detail-info-item'>Currencies: <span id='currencies'>${countryDetail[0].currencies[0].name}</span></p>
                            <p class='country-detail-info-item'>Languages: <span id='languages'>${countryDetail[0].languages[0].name}</span></p>
                        </div>
                    </div>
                    <div id="borders-list" class="borders-list">
                        <p class="borders-text">Borders: <span>${bordersNames}</span></p>
                    </div>
            
        `
        cardContainer.innerHTML = countryCard
    }catch(error){
        console.log(error)
    }
}