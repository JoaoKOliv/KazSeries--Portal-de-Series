const apiKey = '9e27e523dedfe846181a06dba2ef7f47';
let currentPage = 1;
let loadedSeries = [];

// Carregar as séries mais bem avaliadas
function carregarSeries() {
    fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=pt-BR&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const container = document.querySelector('.sequencial');
                const newUl = document.createElement('ul');
                newUl.classList.add('sequencialseries');

                let addedCount = 0;
                data.results.forEach(serie => {
                    if (!loadedSeries.includes(serie.id) && addedCount < 4) {
                        const newLi = document.createElement('li');

                        // Banner da série
                        const newImg = document.createElement('img');
                        newImg.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
                        newImg.alt = serie.name;

                        // Ação de abrir o popup ao clicar
                        newLi.onclick = () => abrirPopupDetalheSerie(serie);

                        newLi.appendChild(newImg);
                        newUl.appendChild(newLi);

                        loadedSeries.push(serie.id);
                        addedCount++;
                    }
                });

                container.appendChild(newUl);
                currentPage++;
            } else {
                console.error('Nenhuma série encontrada para exibição.');
            }
        })
        .catch(error => console.error('Erro ao buscar séries:', error));
}

// Abrir o popup com os detalhes da série
function abrirPopupDetalheSerie(serie) {
    const popup = document.getElementById('popup-detalhe');
    const nome = document.getElementById('nome');
    const descricao = document.getElementById('descricao');
    const imagem = document.getElementById('imagem-detalhe');
    const atoresLista = document.querySelector('.atoresSequencial');

    nome.textContent = serie.name;
    descricao.textContent = serie.overview || 'Descrição não disponível.';
    imagem.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
    imagem.alt = serie.name;

    atoresLista.innerHTML = '';

    // Buscar elenco da série
    fetch(`https://api.themoviedb.org/3/tv/${serie.id}/credits?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            if (data.cast && data.cast.length > 0) {
                data.cast.slice(0, 3).forEach(ator => {
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    const p = document.createElement('p');

                    img.src = ator.profile_path 
                        ? `https://image.tmdb.org/t/p/w200/${ator.profile_path}` 
                        : 'https://via.placeholder.com/100';
                    img.alt = ator.name;
                    p.textContent = ator.name;

                    li.appendChild(img);
                    li.appendChild(p);
                    atoresLista.appendChild(li);
                }); 
            } else {
                const li = document.createElement('li');
                li.textContent = 'Nenhum ator encontrado.';
                atoresLista.appendChild(li);
            }
        })
        .catch(error => console.error('Erro ao buscar elenco da série:', error));

    // Mostrar o popup
    popup.style.display = 'flex';
}

// Fechar o popup
function fecharPopupDetalhe() {
    const popup = document.getElementById('popup-detalhe');
    popup.style.display = 'none';
}

// Carregar mais séries
function loadMoreItems() {
    carregarSeries();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
}

// Adicionar o evento de fechar o popup
document.getElementById('close-detalhe').addEventListener('click', fecharPopupDetalhe);

// Evento de carregar mais séries ao clicar no botão
document.getElementById('loadMoreButton').addEventListener('click', loadMoreItems);

// Carregar as séries ao carregar a página
window.onload = function() {
    carregarSeries();
};
