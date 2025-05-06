import { MD3DarkTheme, configureFonts } from 'react-native-paper';

const theme = {
    ...MD3DarkTheme.colors,
    colors: {
        primary: '#FF5350', // Vermelho Pokémon
        secondary: '#3B4CCA', // Azul Pokémon
        background: '#121212',
        surface: '#1E1E1E',
        card: '#252525',
        text: '#FFFFFF',
        border: '#2C2C2C',
        error: '#E53935',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    pokemonColors: {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC',
    }
}

export default theme;