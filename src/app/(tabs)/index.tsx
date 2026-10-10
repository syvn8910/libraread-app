import { ScrollView, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getPopular, getStories } from '@/api/stories';
import { useFetch } from '@/hooks/useFetch';
import StoryCard from '@/components/StoryCard';
import Center from '@/components/Center';
import { colors, gradientFor, space } from '@/constants/tokens';

export default function Home() {
  const { data: popular, loading, error, reload } = useFetch(getPopular);
  const { data: all } = useFetch(getStories);

  if (loading) return <Center spinner text="Opening the library…" />;
  if (error || !popular) return <Center text={error ?? 'Something went wrong'} onRetry={reload} />;

  const hero = popular[0];
  const genres = Array.from(new Set((all ?? []).flatMap(s => s.genres)));

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.hello}>What will you{'\n'}read tonight?</Text>

      <Pressable onPress={() => router.push(`/story/${hero.id}`)} style={{ marginHorizontal: space.md }}>
        <LinearGradient colors={gradientFor(hero.genre)} style={s.hero}>
          <Text style={s.badge}>MOST READ</Text>
          <Text style={s.heroTitle}>{hero.title}</Text>
          <Text style={s.heroSub} numberOfLines={2}>{hero.synopsis}</Text>
        </LinearGradient>
      </Pressable>

      <Text style={s.header}>Popular now</Text>
      <FlatList
        horizontal
        data={popular.slice(1, 9)}
        keyExtractor={i => `${i.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.md, gap: 14 }}
        renderItem={({ item }) => <StoryCard story={item} />}
      />

      <Text style={s.header}>Browse by genre</Text>
      <View style={s.chips}>
        {genres.map(g => (
          <Pressable key={g} style={s.chip} onPress={() => router.push(`/genre/${encodeURIComponent(g)}`)}>
            <Text style={s.chipText}>{g}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hello: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 32, margin: space.md, marginTop: 64 },
  hero: { borderRadius: 22, padding: 22, minHeight: 190, justifyContent: 'flex-end' },
  badge: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  heroTitle: { color: '#fff', fontFamily: 'Lora_700Bold', fontSize: 26 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular', marginTop: 6 },
  header: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 20, margin: space.md, marginTop: 28 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: space.md },
  chip: { backgroundColor: colors.surface2, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999 },
  chipText: { color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 13 },
});