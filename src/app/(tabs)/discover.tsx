import { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { getStories } from '@/api/stories';
import { useFetch } from '@/hooks/useFetch';
import StoryCard from '@/components/StoryCard';
import Center from '@/components/Center';
import { colors, space } from '@/constants/tokens';

export default function Discover() {
  const { data, loading, error, reload } = useFetch(getStories);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const { width } = useWindowDimensions();
  const cardW = (width - space.md * 2 - 14) / 2;

  const genres = useMemo(() => ['All', ...Array.from(new Set((data ?? []).flatMap(s => s.genres)))], [data]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(s =>
      (genre === 'All' || s.genres.includes(genre)) &&
      (!q || s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q))
    );
  }, [data, query, genre]);

  if (loading) return <Center spinner text="Loading stories…" />;
  if (error || !data) return <Center text={error ?? 'Error'} onRetry={reload} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={s.title}>Discover</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search title, author, genre"
        placeholderTextColor={colors.muted}
        style={s.search}
      />
      <View style={{ height: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.md, gap: 8, alignItems: 'center' }}>
          {genres.map(g => (
            <Pressable key={g} onPress={() => setGenre(g)}
              style={[s.chip, genre === g && { backgroundColor: colors.accent }]}>
              <Text style={[s.chipText, genre === g && { color: '#fff' }]}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={i => `${i.id}`}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: space.md }}
        contentContainerStyle={{ gap: 22, paddingTop: 12, paddingBottom: 40 }}
        renderItem={({ item }) => <StoryCard story={item} width={cardW} />}
        ListEmptyComponent={<Text style={s.empty}>No stories found.</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  title: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 30, marginTop: 64, marginHorizontal: space.md },
  search: {
    backgroundColor: colors.surface2, color: colors.text, fontFamily: 'Inter_400Regular',
    marginHorizontal: space.md, marginVertical: 14, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
  },
  chip: { backgroundColor: colors.surface2, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  chipText: { color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 13 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40, fontFamily: 'Inter_400Regular' },
});