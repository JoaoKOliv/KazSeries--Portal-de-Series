
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicadores-carrossel button');

    let indiceAtual = 0;
    const intervaloTempo = 4000;

    function atualizarCarrossel() {

      slides.forEach((slide, indice) => {
        slide.classList.toggle('ativo', indice === indiceAtual);
      });


      indicadores.forEach((indicador, indice) => {
        indicador.classList.toggle('ativo', indice === indiceAtual);
      });
    }

    function proximoSlide() {
      // Avançar para o próximo slide
      indiceAtual = (indiceAtual + 1) % slides.length; 
      atualizarCarrossel();
    }


    indicadores.forEach((indicador, indice) => {
      indicador.addEventListener('click', () => {
        indiceAtual = indice;
        atualizarCarrossel();
      });
    });

    setInterval(proximoSlide, intervaloTempo);