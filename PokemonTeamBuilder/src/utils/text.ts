/**
 * Capitaliza o primeiro caractere de uma string e substitui hífens por espaços
 * @example "test-string" -> "Test string"
 */
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, ' ');
}

/**
 * Formata o nome do Pokémon removendo traços e aplicando capitalização
 */
export function formatPokemonName(name: string): string {
    if (!name) return '';
    return name.split('-').map(capitalize).join(' ');
}