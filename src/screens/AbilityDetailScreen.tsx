import { capitalize } from '../utils/text'; // Crie esta função utilitária se não tiver

// Função de tradução via MyMemory - gratuita, sem chave e sem limitação estrita
async function translateToPortuguese(text: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|pt-BR`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text; // retorna o original se falhar
  } catch (error) {
    console.error('Erro na tradução:', error);
    return text; // retorna o original em caso de erro
  }
}

export default function AbilityDetailScreen({ route, navigation }: Props) {
  const { abilityName, abilityUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abilityDetail, setAbilityDetail] = useState<AbilityDetail | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [description, setDescription] = useState<string>('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetch(abilityUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        setAbilityDetail(data);
        
        // Processa lista de pokemon
        // ...código existente...
        
        // Lida com a descrição
        const ptEntry = data.effect_entries.find(
          (entry: any) => entry.language.name === 'pt-br'
        );
        
        if (ptEntry) {
          // Já temos em português!
          setDescription(ptEntry.effect);
        } else {
          // Precisa traduzir do inglês
          const enEntry = data.effect_entries.find(
            (entry: any) => entry.language.name === 'en'
          );
          
          if (enEntry) {
            setTranslating(true);
            try {
              const translated = await translateToPortuguese(enEntry.effect);
              setDescription(translated);
            } catch (e) {
              // Se falhar a tradução, mostra o original em inglês
              setDescription(enEntry.effect);
            } finally {
              setTranslating(false);
            }
          } else {
            setDescription('Descrição não disponível');
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Não foi possível carregar os detalhes da habilidade');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [abilityUrl]);

  // ... loading e error handlers ...

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <Text style={styles.abilityTitle}>
          {abilityName.charAt(0).toUpperCase() + abilityName.slice(1).replace(/-/g, ' ')}
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          
          {translating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.translatingText}>Traduzindo...</Text>
            </View>
          ) : (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        
        {/* Resto do conteúdo (lista de pokémon) */}
      </ScrollView>
    </SafeAreaView>
  );
}

// Adicione/modifique estes estilos
const styles = StyleSheet.create({
  // ... estilos existentes ...
  
  abilityTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  
  translatingText: {
    marginLeft: 8,
    color: theme.colors.text,
    fontSize: 16,
  },
});

// Crie um arquivo de utilidades para text
// src/utils/text.ts
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, ' ');
} 