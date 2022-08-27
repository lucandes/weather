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

function startRequest() {
    infobox.classList.remove('denied');
    infobox.classList.add('show');
    infobox.innerHTML = 'Carregando resultados...';
    requestAPI(entrada.value);
}

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

async function requestAPI(query){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&lang=pt_br&appid=${apiKey}`)
        .then(
        response => response.json())
            .then(cidade => {
                let notfound = cidade.cod == '404';

                if (notfound){
                    infobox.classList.add('denied')
                    infobox.innerHTML = 'Ooops! Cidade não encontrada. Tente novamente.';
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

                    icone.innerHTML = '<img src="http://openweathermap.org/img/wn/' + iconcode + '.png" alt="weather icon">';
                    body.style.backgroundImage = 'url(../img/' + iconcode + '.jpg)';
                    // body.style.backgroundSize = 'min(1400px)';
                    // screen change 
                    document.querySelector('.procurar').classList.toggle('hidden');
                    document.querySelector('.resultado').classList.toggle('hidden');
                }
            })
            ;
    
    // await let geoloc = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${cidade}`;
    // fetch(geoloc).then(response => (console.log(response.json())));

    // let api = 'https://api.openweathermap.org/data/2.5/weather?q={${cidade}}&appid={7b311962297a04ba68c3b5f0737ab5ba}}';
    // fetch(api).then(response => (console.log(response.json())));

}