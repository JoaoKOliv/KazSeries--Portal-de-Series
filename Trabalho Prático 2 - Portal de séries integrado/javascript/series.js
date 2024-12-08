    const apiKey = '9e27e523dedfe846181a06dba2ef7f47';
    let currentPage = 1;
    let loadedSeries = [];

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
    
                            const newImg = document.createElement('img');
                            newImg.src = `https://image.tmdb.org/t/p/w500/${serie.poster_path}`;
                            newImg.alt = serie.name;
    
                            newLi.onclick = () => abrirPopupDetalheSerie(serie);
    
                            newLi.appendChild(newImg);
                            newUl.appendChild(newLi);
    
                            loadedSeries.push(serie.id);
                            addedCount++;
                        }
                    });
    
                    container.appendChild(newUl);
                    currentPage++;

                    atualizarBotaoFavoritos();
                } else {
                    console.error('Nenhuma série encontrada para exibição.');
                }
            })
            .catch(error => console.error('Erro ao buscar séries:', error));
    }
    
    function atualizarBotaoFavoritos() {
        const allSeries = document.querySelectorAll('.sequencialseries li');
        allSeries.forEach(li => {
            const serieId = li.dataset.id;  
            const addToFavoritesButton = li.querySelector('.addToFavoritesButton');
    
            if (isFavorito(serieId)) {
                addToFavoritesButton.textContent = 'Remover dos Favoritos';
            } else {
                addToFavoritesButton.textContent = 'Adicionar aos Favoritos';
            }
    
            addToFavoritesButton.onclick = () => {
                if (isFavorito(serieId)) {
                    removerDosFavoritos(serieId);
                } else {
                    adicionarAosFavoritos(serieId);
                }
            };
        });
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
    
        alert(`${serie.name} foi removida dos favoritos!`);
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

    document.getElementById('close-detalhe').addEventListener('click', fecharPopupDetalhe);

    document.getElementById('loadMoreButton').addEventListener('click', loadMoreItems);

    window.onload = function () {
        carregarSeries();
        carregarFavoritosDoLocalStorage();
    };

    function fecharPopupDetalhe() {
        const popup = document.getElementById('popup-detalhe');
        popup.style.display = 'none';
    }

    function loadMoreItems() {
        carregarSeries();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
