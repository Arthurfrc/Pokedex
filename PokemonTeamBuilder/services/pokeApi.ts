// Serviço para buscar lista de Pokémon e detalhes na PokéAPI

const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

/**
 * Busca a lista de Pokémon paginada
 * @param page Página (1-based)
 * @param limit Quantidade por página
 */
export async function fetchPokemonList(
  page: number,
  limit: number
): Promise<PokemonListItem[]> {
  const offset = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();
  return data.results;
}

/**
 * Busca detalhes completos de um Pokémon pelo nome
 * @param name Nome do Pokémon
 */
export async function fetchPokemonDetails(name: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  const data = await response.json();
  return data;
} 