const container = document.querySelector('.mainbox');
const infobox = document.querySelector('.infobox');
const entrada = document.querySelector('.entrada');
const botao_buscar = document.querySelector('.buscar');
const geolocalizacao = document.querySelector('.geolocalizacao');
const nomecidade = document.querySelector('.nomecidade');
const temperatura = document.querySelector('.temperatura');
const descricao = document.querySelector('.descricao-tempo');
const sensasao = document.querySelector('.temperatura-sensacao');
const umidade = document.querySelector('.valor-umidade');
const apiKey = '10a6fb1b7a5945d609396a98b8b10b1e';

// nomeestado.classList.

entrada.addEventListener('keyup', e => {
    if (e.key == 'Enter' && entrada.value != ''){
        requestAPI(entrada.value);
    }
})

botao_buscar.addEventListener('click', () => {
    if (entrada.value != ''){
        requestAPI(entrada.value);
    }
})

async function requestAPI(query){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&lang=pt_br&appid=${apiKey}`)
        .then(
        response => response.json())
        
            .then(cidade => {
                console.log(cidade);
                container.classList.remove('first');
                container.classList.add('second');

                nomecidade.innerHTML = cidade.name + '<span>' + cidade.sys.country + '</span>';
                temperatura.innerHTML = Math.round(cidade.main.temp) + '<span>°C</span>';
                descricao.innerHTML = cidade.weather[0].description;
                sensasao.innerHTML = Math.round(cidade.main.feels_like) + '<span>°C</span>';;
                umidade.innerHTML = cidade.main.humidity+'%';

                document.querySelector('body').style.backgroundImage = 'url(../img/' + cidade.weather[0].icon + '.jpg)';
                // document.querySelector('body').style.backgroundSize = 'min(1400px)';
                // screen change 
                document.querySelector('.procurar').classList.toggle('hidden');
                document.querySelector('.resultado').classList.toggle('hidden');

            })
            .catch((error) => {console.error('Error: ', error);});
    
    // await let geoloc = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${cidade}`;
    // fetch(geoloc).then(response => (console.log(response.json())));

    // let api = 'https://api.openweathermap.org/data/2.5/weather?q={${cidade}}&appid={7b311962297a04ba68c3b5f0737ab5ba}}';
    // fetch(api).then(response => (console.log(response.json())));

}