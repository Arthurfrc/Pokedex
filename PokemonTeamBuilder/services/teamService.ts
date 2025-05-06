import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team } from '@/types/Pokemon';

const TEAMS_KEY = 'teams';

/**
 * Recupera todas as equipes salvas
 */
export async function getTeams(): Promise<Team[]> {
  try {
    const json = await AsyncStorage.getItem(TEAMS_KEY);
    if (json) {
      return JSON.parse(json) as Team[];
    }
    return [];
  } catch (e) {
    console.error('Erro ao recuperar equipes:', e);
    return [];
  }
}

/**
 * Salva uma nova equipe (append no array existente)
 */
export async function saveTeam(team: Team): Promise<void> {
  try {
    const existing = await getTeams();
    const updated = [...existing, team];
    await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar equipe:', e);
    throw e;
  }
} 