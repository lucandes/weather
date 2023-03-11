const body = document.querySelector('body');
const container = document.querySelector('.mainbox');
const infobox = document.querySelector('.infobox');
const entrada = document.querySelector('.entrada');
const botao_buscar = document.querySelector('.buscar');
const geolocalizacao = document.querySelector('.geolocalizacao');
const retornar = document.querySelector('.retornar');
const nomecidade = document.querySelector('.nomecidade');
const icone = document.querySelector('.icone');
const temperatura = document.querySelector('.temperatura');
const descricao = document.querySelector('.descricao-tempo');
const sensasao = document.querySelector('.temperatura-sensacao');
const umidade = document.querySelector('.valor-umidade');
const apiKey = '10a6fb1b7a5945d609396a98b8b10b1e';

// nomeestado.classList.

entrada.addEventListener('keyup', e => {
    if (e.key == 'Enter' && entrada.value != ''){ startRequest(); }})

botao_buscar.addEventListener('click', () => { if (entrada.value != '') startRequest(); })

retornar.addEventListener('click', () => {
    document.querySelector('.procurar').classList.toggle('hidden');
    document.querySelector('.resultado').classList.toggle('hidden');
    container.classList.add('first');
    container.classList.remove('second');
    infobox.classList.remove('show');
    infobox.classList.remove('denied');
    
    entrada.value = '';
    body.style.backgroundImage = 'url(../img/searchbg.jpg)';
})

geolocalizacao.addEventListener('click', () => {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onsucess, infobox_geoloc_error);
    }else {
        infobox_geoloc_indisponivel();
    }
})

function onsucess(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    infobox_carregando();
    requestWeatherAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`)
}

async function startRequest() {
    infobox_carregando();
    let cityName = entrada.value;
    let location = await requestWeatherAPI(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${apiKey}`);
    const cityDetails = await requestCitiesAPI(cityName);
    console.log(cityDetails['data']);
    
}

async function requestWeatherAPI(request){
    return await fetch(request)
        .then(
        response => response.json())
            .then(cidade => {
                let notfound = cidade.cod == '404';

                if (notfound){
                    infobox_semresultados();
                }else{
                    console.log(cidade);
                    container.classList.remove('first');
                    container.classList.add('second');

                    nomecidade.innerHTML = cidade.name + '<span>' + cidade.sys.country + '</span>';

                    // font size adjust
                    if (cidade.name.length > 10){
                        let fs = 50;
                        fs -= 4 * (cidade.name.length - 10);
                        nomecidade.style.fontSize = fs;
                        console.log(nomecidade.style.fontSize);
                    }

                    temperatura.innerHTML = Math.round(cidade.main.temp) + '<span>°C</span>';
                    descricao.innerHTML = cidade.weather[0].description;
                    sensasao.innerHTML = Math.round(cidade.main.feels_like) + '<span>°C</span>';;
                    umidade.innerHTML = cidade.main.humidity+'%';

                    let iconcode = cidade.weather[0].icon;

                    icone.innerHTML = '<img src="http://openweathermap.org/img/wn/' 
                        + iconcode + '.png" alt="weather icon" title="Ícone de Clima">';
                    
                    body.style.backgroundImage = 'url(../img/' + iconcode + '.jpg)';

                    cityDetailsXML(cidade.name);

                    // screen change 
                    document.querySelector('.procurar').classList.toggle('hidden');
                    document.querySelector('.resultado').classList.toggle('hidden');
                }
            })
}

async function requestCitiesAPI(cityName){
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fbd67195e6mshe076c75e69cd312p13f294jsnb45fc9476bfc',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    return await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}`, options)
        .then(response => response.json())
        .then(response => {
            return response;
        })
}

/**
 * Returns informations about current time, time zone and date.
 * @param {*} cityCode The city id (either native id or wikiDataId)
 */
async function requestCityTimeAPI(cityCode){
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fbd67195e6mshe076c75e69cd312p13f294jsnb45fc9476bfc',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    
    await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityCode}/dateTime`, options)
        .then(response => response.json())
        .then(response => {return response})
        .catch(err => console.error(err));
}

function infobox_carregando(){
    infobox.innerHTML = 'Carregando resultados...';
    infobox.classList.remove('denied');
    infobox.classList.add('show');
}

function infobox_semresultados(){
    infobox.innerHTML = 'Ooops! Cidade não encontrada. Tente novamente.';
    infobox.classList.add('denied')
}

function infobox_geoloc_error(){
    infobox.innerHTML = 'Erro ao buscar a posição atual do dispositivo';
    infobox.classList.add('denied');
}

function infobox_geoloc_indisponivel(){
    infobox.innerHTML = 'O navegador não suporta o serviço de geolocalização';
    infobox.classList.add('denied');   
}

function cityDetailsXML(cidade){
    let data = "{\n    \"city\": \""+cidade+"\"\n}";
    let request = new XMLHttpRequest();
    request.withCredentials = true;
    request.onload = () => {
        if (request.status == 200){
            console.log(JSON.parse(request.response));
        }else {
            console.log('fudeu');
        }
    }
}

async function cityDetails(cidade){
    let raw = {"city": 'london'};
    
    let options = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch(`https://countriesnow.space/api/v0.1/countries/population/cities/`, options)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}