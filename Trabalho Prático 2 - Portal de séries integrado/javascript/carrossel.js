fetch('https://api.themoviedb.org/3/tv/top_rated?api_key=9e27e523dedfe846181a06dba2ef7f47&language=pt-BR&page=2')
    .then(response => response.json())
    .then(data => {
        const carrossel = document.querySelector('.carrossel');
        const indicadores = document.querySelector('.indicadores-carrossel');
        const series = data.results.slice(0, 3); 

        carrossel.innerHTML = '';
        indicadores.innerHTML = '';

        series.forEach((serie, indice) => {
            const imagemUrl = serie.poster_path ? 'https://image.tmdb.org/t/p/original' + serie.poster_path : 'path/to/default/image.jpg'; 

            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (indice === 0) slide.classList.add('ativo'); 
            slide.innerHTML = `<img src="${imagemUrl}" alt="${serie.name}">`;
            carrossel.appendChild(slide);

            const indicador = document.createElement('button');
            if (indice === 0) indicador.classList.add('ativo');
            indicadores.appendChild(indicador);
        });

        const slides = document.querySelectorAll('.slide');
        const indicadoresBtns = document.querySelectorAll('.indicadores-carrossel button'); 

        let indiceAtual = 0;
        const intervaloTempo = 4000;

        function atualizarCarrossel() {
            slides.forEach((slide, indice) => {
                slide.classList.toggle('ativo', indice === indiceAtual);
            });

            indicadoresBtns.forEach((indicador, indice) => {
                indicador.classList.toggle('ativo', indice === indiceAtual);
            });
        }

        function proximoSlide() {
            indiceAtual = (indiceAtual + 1) % slides.length;
            atualizarCarrossel();
        }


        indicadoresBtns.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                indiceAtual = indice;
                atualizarCarrossel();
            });
        });

        setInterval(proximoSlide, intervaloTempo);
    })
    .catch(error => console.log('Erro ao carregar dados da API: ', error));
