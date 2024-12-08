function carregarSeriesAvaliadas() {
    fetch('https://api.themoviedb.org/3/tv/top_rated?api_key=9e27e523dedfe846181a06dba2ef7f47&language=pt-BR&page=1')
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const list1 = document.querySelectorAll('.sequencial-1 li');
                const list2 = document.querySelectorAll('.sequencial-2 li');
                const allItems = [...list1, ...list2];

                data.results.slice(0, allItems.length).forEach((serie, index) => {
                    const li = allItems[index];
                    const img = li.querySelector('img');
                    img.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
                    img.alt = serie.name;

                    let title = li.querySelector('p');
                    if (!title) {
                        title = document.createElement('p');
                        li.appendChild(title);
                    }
                    title.textContent = serie.name;

                    li.onclick = () => abrirPopupDetalheSerie(serie);
                });
            } else {
                console.error('Nenhuma série encontrada para exibição.');
            }
        })
        .catch(error => console.error('Erro ao buscar séries:', error));
}

function abrirPopupDetalheSerie(serie) {
    const popup = document.getElementById('popup-detalhe');
    const nome = document.getElementById('nome');
    const descricao = document.getElementById('descricao');
    const imagem = document.getElementById('imagem-detalhe');
    const atoresLista = document.querySelector('.atoresSequencial');
    const addToFavoritesButton = document.getElementById('addToFavoritesButton');

    nome.textContent = serie.name;
    descricao.textContent = serie.overview || 'Descrição não disponível.';
    imagem.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
    imagem.alt = serie.name;

    atoresLista.innerHTML = '';

    fetch(`https://api.themoviedb.org/3/tv/${serie.id}/credits?api_key=9e27e523dedfe846181a06dba2ef7f47&language=pt-BR`)
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

    if (isFavorito(serie.id)) {
        addToFavoritesButton.textContent = 'Remover dos Favoritos';
    } else {
        addToFavoritesButton.textContent = 'Adicionar aos Favoritos';
    }

    addToFavoritesButton.onclick = () => {
        if (isFavorito(serie.id)) {
            removerDosFavoritos(serie);
        } else {
            adicionarAosFavoritos(serie);
        }
    };

    popup.style.display = 'flex';
    document.getElementById('close-detalhe').onclick = fecharPopupDetalhe;
}

function isFavorito(serieId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    return favoritos.some(fav => fav.id === serieId);
}

function adicionarAosFavoritos(serie) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (!favoritos.some(fav => fav.id === serie.id)) {
        favoritos.push(serie);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        
        const listaFavoritos = document.querySelector('.sequencial-1Favs');
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
        img.alt = serie.name;
        li.appendChild(img);
        listaFavoritos.appendChild(li);
        
        alert(`${serie.name} foi adicionada aos favoritos!`);
    }
}

window.addEventListener('storage', function(event) {
    if (event.key === 'favoritos') {
        carregarFavoritos();
    }
});

function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const menuFavoritos = document.getElementById('menuFavoritos');

    menuFavoritos.innerHTML = '';

    favoritos.forEach(serie => {
        const li = document.createElement('li');
        li.textContent = serie.name;
        menuFavoritos.appendChild(li);
    });
}

carregarFavoritos();

function removerDosFavoritos(serie) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    favoritos = favoritos.filter(fav => fav.id !== serie.id);

    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    const listaFavoritos = document.querySelector('.sequencial-1Favs');
    const items = listaFavoritos.querySelectorAll('li');
    items.forEach(item => {
        const img = item.querySelector('img');
        if (img.alt === serie.name) {
            listaFavoritos.removeChild(item);
        }
    });

    const addToFavoritesButton = document.getElementById('addToFavoritesButton');
    addToFavoritesButton.textContent = 'Adicionar aos Favoritos';

    alert(`${serie.name} foi removida dos favoritos!`);
}

function salvarFavoritosNoLocalStorage(serie) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (!favoritos.some(fav => fav.id === serie.id)) {
        favoritos.push(serie);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
}

function carregarFavoritosDoLocalStorage() {
    const listaFavoritos = document.querySelector('.sequencial-1Favs');
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    listaFavoritos.innerHTML = '';

    favoritos.forEach(serie => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
        img.alt = serie.name;

        li.appendChild(img);

        li.onclick = () => abrirPopupDetalheSerie(serie);

        listaFavoritos.appendChild(li);
    });
}


function fecharPopupDetalhe() {
    const popup = document.getElementById('popup-detalhe');
    popup.style.display = 'none';
}

window.onload = function() {
    carregarFavoritosDoLocalStorage();
};

carregarSeriesAvaliadas();
carregarFavoritosDoLocalStorage();
