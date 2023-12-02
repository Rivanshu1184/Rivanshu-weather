
// function renderWeatherInfo(data){
//     let newhead = document.createElement('h1');
//     // newpara.textContent = data.main.temp ;
//     newhead.textContent = `${data?.main?.temp.toFixed(2)} C` ;
    
//     document.body.appendChild(newhead) ;
// }




const userTab = document.querySelector("[data-userWeather]") ;
const searchTab = document.querySelector("[data-searchWeather]") ;
const userContainer = document.querySelector(".weather-container") ;

const grantAccessContainer  = document.querySelector(".grant-location-container") ;
const userInfoContainer = document.querySelector(".user-info-container") ;
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container") ;


// openWeatherMap api:
let API_KEY = "93c09e787bfb7db17d03f3a622308457" ;



// current tab -> Currently On which I had clicked upon 
// by-default -> userTab
let currentTab = userTab ;
currentTab.classList.add("current-tab") ;

// if sessionstorage already contains coordinates 
getfromSessionStorage() ;


// tab switching
function switchTab(clickedTab){

    // agar tumne same tab pe nhi click kiya hai
    if(clickedTab != currentTab){
        // now remove the background color from currentTab and apply to clicked tab.
        currentTab.classList.remove("current-tab") ;
        currentTab = clickedTab ;
        currentTab.classList.add("current-tab") ;


        // if searchForm active nhi hai , then active it .
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active") ;
            grantAccessContainer.classList.remove("active") ;
            searchForm.classList.add("active") ;
        }
        else{
            // currently at searchTab , just now shift to yourWeather tab.
            searchForm.classList.remove("active") ;
            userInfoContainer.classList.remove("active") ;
            // As we are at yourweather tab , so display weather . lets search for coordinates saved in local storage.
            getfromSessionStorage() ;
        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab) ;
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab) ;
})



// check if coordinates are already present in the session storage.
function getfromSessionStorage(){
    // checking if coordinates are present in the session storage.
    const localCoordinates = sessionStorage.getItem("user-coordinates") ;

    // agar local coordinates nhi mile , then we had to show grant access page
    if(!localCoordinates){
        grantAccessContainer.classList.add("active") ;
    }   
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates) ;
    } 
} 


async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates ;

    // make grant container invisible
    grantAccessContainer.classList.remove("active") ;
    // make loader visible 
    loadingScreen.classList.add("active") ;

    // api call
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;
        const  data = await response.json() ;

        // now data has arrived, just remove loader now 
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;

        // render 
        renderWeatherInfo(data) ;
    }
    catch(err){
        loadingScreen.classList.remove("active") ;
        console.log(err) ;
    }
} 


// rendering function
function renderWeatherInfo(data){
    console.log(data) ;

    // firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]") ;
    const countryIcon = document.querySelector("[data-countryIcon]") ;
    const desc = document.querySelector("[data-weatherDesc]") ;
    const weatherIcon = document.querySelector("[data-weatherIcon]") ;
    const temp = document.querySelector("[data-temp]") ;
    const windspeed = document.querySelector("[data-windspeed]") ;
    const humidity = document.querySelector("[data-humidity]") ;
    const cloudiness = document.querySelector("[data-cloudiness]") ;
 
    
    // now fetching elements from data object and put it in UI elements.
    cityName.innerText=data?.name ;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png` ;
    desc.innerText=data?.weather?.[0]?.description ;
    weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png` ;
    temp.innerText=`${data?.main?.temp}°C` ;
    windspeed.innerText=`${data?.wind?.speed}m/s` ;
    humidity.innerText=`${data?.main?.humidity}%` ;
    cloudiness.innerText=`${data?.clouds?.all}%` ;

    // userInfoContainer.classList.add("active") ;
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos)=>{
            
            const userCoordinates = {
                lat : pos.coords.latitude ,
                lon : pos.coords.longitude 
            };

            sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates)) ;
            fetchUserWeatherInfo(userCoordinates) ;
        })
    }
    else{
        alert("No geolocation support available") ;
    }
}

// grant access button listener
const grantAccessButton = document.querySelector("[data-grantAccess]") ;
grantAccessButton.addEventListener("click" , getLocation) ;



const searchInput = document.querySelector("[data-searchInput]") ;

searchForm.addEventListener("submit",(event)=>{
    event.preventDefault() ;

    let cityName = searchInput.value ;

    if(cityName === ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName) ;
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active") ;
    userInfoContainer.classList.remove("active") ;
    grantAccessContainer.classList.remove("active") ;

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`) ;
        let data = await response.json();

        // now data has arrived, just remove loader now 
        loadingScreen.classList.remove("active") ;

        if(data?.cod != '404'){
            userInfoContainer.classList.add("active") ;
            renderWeatherInfo(data) ;
        }
        
    }
    catch(err){
        console.log(err) ;
    }
}





