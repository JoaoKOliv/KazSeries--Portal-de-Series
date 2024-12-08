
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

    popup.style.display = 'flex';
}

function fecharPopupDetalhe() {
    const popup = document.getElementById('popup-detalhe');
    popup.style.display = 'none';
}

document.getElementById('close-detalhe').addEventListener('click', fecharPopupDetalhe);