// Dados fictícios para personagens (substitua por dados reais ou conecte a uma API)
// Lista de personagens com caminhos para as imagens
const personagens = [
    { nome: "Ash Ketchum", imagem: "imagens/personagens/ash.png" },
    { nome: "Misty", imagem: "imagens/personagens/misty.png" },
    { nome: "Brock", imagem: "imagens/personagens/brock.png" },
    { nome: "Pikachu", imagem: "imagens/personagens/pikachu.png" },
    { nome: "Gary Oak", imagem: "imagens/personagens/gary.png" },
    { nome: "May", imagem: "imagens/personagens/may.png" },
    { nome: "Dawn", imagem: "imagens/personagens/dawn.png" },
    { nome: "Serena", imagem: "imagens/personagens/serena.png" },
    { nome: "Clemont", imagem: "imagens/personagens/clemont.png" },
    { nome: "Iris", imagem: "imagens/personagens/iris.png" },
    { nome: "Tracy", imagem: "imagens/personagens/tracy.png" },
    { nome: "Paul", imagem: "imagens/personagens/paul.png" },
    { nome: "Cynthia", imagem: "imagens/personagens/cynthia.png" },
    { nome: "Professor Oak", imagem: "imagens/personagens/professor_oak.png" },
    { nome: "Professor Sycamore", imagem: "imagens/personagens/professor_sycamore.png" },
    { nome: "Jesse", imagem: "imagens/personagens/jesse.png" },
    { nome: "James", imagem: "imagens/personagens/james.png" },
    { nome: "Blaine", imagem: "imagens/personagens/blaine.png" },
    { nome: "Flint", imagem: "imagens/personagens/flint.png" },
    { nome: "Hop", imagem: "imagens/personagens/hop.png" },
    { nome: "Red", imagem: "imagens/personagens/red.png" },
    { nome: "Blue", imagem: "imagens/personagens/blue.png" },
    { nome: "Silver", imagem: "imagens/personagens/silver.png" },
    { nome: "Maylene", imagem: "imagens/personagens/maylene.png" },
    { nome: "Lyra", imagem: "imagens/personagens/lyra.png" },
    { nome: "Cheryl", imagem: "imagens/personagens/cheryl.png" },
    { nome: "N", imagem: "imagens/personagens/n.png" },
    { nome: "Brawly", imagem: "imagens/personagens/brawly.png" },
    { nome: "Gardenia", imagem: "imagens/personagens/gardenia.png" },
    { nome: "Flannery", imagem: "imagens/personagens/flannery.png" },
    { nome: "Elesa", imagem: "imagens/personagens/elesa.png" },
    { nome: "Korrina", imagem: "imagens/personagens/korrina.png" },
  ];
  
  
  // Referências aos elementos
  const searchinput = document.getElementById("searchinput");
  const charactersContainer = document.getElementById("charactersContainer");
  
  // Função para exibir personagens
  function exibirPersonagens(filtrados) {
    charactersContainer.innerHTML = ""; // Limpa os resultados anteriores
    filtrados.forEach((personagem) => {
      const card = document.createElement("div");
      card.classList.add("character-card");
  
      card.innerHTML = `
        <img src="${personagem.imagem}" alt="${personagem.nome}">
        <h3>${personagem.nome}</h3>
      `;
  
      charactersContainer.appendChild(card);
    });
  }
  
  // Inicializa com todos os personagens
  exibirPersonagens(personagens);
  
  // Função de busca dinâmica
  searchinput.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = personagens.filter((personagem) =>
      personagem.nome.toLowerCase().includes(termo)
    );
    exibirPersonagens(filtrados);
  });
  