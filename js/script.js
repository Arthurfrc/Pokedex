const csvFilePath = '../description/Pokemon.csv'

function createElementWithClass(elementName, className) {
    const element = document.createElement(elementName);

    element.classList.add(className);

    return element;
}

function createPokemonListElement(pokemon) {
    const ul = createElementWithClass('ul', 'listagem-pokemon');
    const li = createElementWithClass('li', 'card-pokemon');
    const informationsDiv = createElementWithClass('div', 'informations');
    const naeSpan = createElementWithClass('span');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = pokemon.name.toUpperCase();
    informationsDiv.appendChild(nameSpan);

    const numberSpan = document.createElement('span');
    numberSpan.textContent = `#${pokemon.id}`;
    informationsDiv.appendChild(numberSpan);
    li.appendChild(informationsDiv);

    const img = document.createElement('img');
    img.src = `http://www.smogon.com/dex/media/sprites/xy/${pokemon.name.toLowerCase()}.gif`;
    img.alt = pokemon.name;
    img.classList.add('gif');
    li.appendChild(img);

    const typesUl = createElementWithClass('ul', 'types');
    pokemon.types.forEach((type) => {
        const typeLi = createElementWithClass('li', type);
        typeLi.textContent = type;
        typesUl.appendChild(typeLi);
    });
    li.appendChild(typesUl);

    const descriptionP = createElementWithClass('p', 'description');
    descriptionP.style.fontFamily = 'Poppins';
    descriptionP.textContent = pokemon.description;
    li.appendChild(descriptionP);
    ul.appendChild(li);

    return ul;
}

function processCSV(csvData) {
    const parsedData = Papa.parse(csvData, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
    });

    const pokemonList = document.getElementById('pokemon-list');

    parsedData.data.forEach((row) => {
        const pokemon = {
            id: row.ID.trim(),
            name: row.Name.trim(),
            types: [row.Type1.trim(), row.Type2.trim()].filter(Boolean),
            description: row.description,
        };

        const pokemonElement = createPokemonListElement(pokemon);
        pokemonList
    });
}