import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getStories } from '@/api/stories';
import { useFetch } from '@/hooks/useFetch';
import { useLibrary } from '@/context/LibraryContext';
import StoryCard from '@/components/StoryCard';
import StoryCover from '@/components/StoryCover';
import Center from '@/components/Center';
import { colors, space } from '@/constants/tokens';

export default function Library() {
  const { data, loading, error, reload } = useFetch(getStories);
  const { savedIds, progress } = useLibrary();

  if (loading) return <Center spinner text="Loading…" />;
  if (error || !data) return <Center text={error ?? 'Error'} onRetry={reload} />;

  const saved = data.filter(s => savedIds.includes(s.id));
  const continuing = data.filter(s => (progress[s.id] ?? 0) > 0 && (progress[s.id] ?? 0) < 100);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.title}>Your Library</Text>

      {continuing.length > 0 && (
        <>
          <Text style={s.header}>Continue reading</Text>
          {continuing.map(st => (
            <Pressable key={st.id} style={s.row} onPress={() => router.push(`/read/${st.id}`)}>
              <StoryCover title={st.title} genre={st.genre} author={st.author} width={60} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.rowTitle} numberOfLines={1}>{st.title}</Text>
                <View style={s.barBg}><View style={[s.barFill, { width: `${progress[st.id]}%` }]} /></View>
                <Text style={s.muted}>{progress[st.id]}% read</Text>
              </View>
            </Pressable>
          ))}
        </>
      )}

      <Text style={s.header}>Saved stories</Text>
      {saved.length === 0 ? (
        <Text style={[s.muted, { marginHorizontal: space.md }]}>
          Nothing saved yet. Open a story and tap Save.
        </Text>
      ) : (
        <FlatList
          horizontal
          data={saved}
          keyExtractor={i => `${i.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.md, gap: 14 }}
          renderItem={({ item }) => <StoryCard story={item} />}
        />
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 30, marginTop: 64, marginHorizontal: space.md },
  header: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 20, margin: space.md, marginTop: 28 },
  row: { flexDirection: 'row', alignItems: 'center', marginHorizontal: space.md, marginBottom: 14 },
  rowTitle: { color: colors.text, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  barBg: { height: 5, backgroundColor: colors.surface2, borderRadius: 3, marginVertical: 8 },
  barFill: { height: 5, backgroundColor: colors.accent, borderRadius: 3 },
  muted: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 12 },
});