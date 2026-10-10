import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getStory, formatReads } from '@/api/stories';
import { gutenbergCover } from '@/utils/images';
import { useFetch } from '@/hooks/useFetch';
import { useLibrary } from '@/context/LibraryContext';
import StoryCover from '@/components/StoryCover';
import Center from '@/components/Center';
import { colors, gradientFor, space } from '@/constants/tokens';

export default function StoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: story, loading, error, reload } = useFetch(() => getStory(Number(id)), [id]);
  const { isSaved, toggleSave, progress } = useLibrary();

  if (loading) return <Center spinner text="Loading…" />;
  if (error || !story) return <Center text={error ?? 'Story not found'} onRetry={reload} />;

  const pct = progress[story.id] ?? 0;
  const saved = isSaved(story.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={[gradientFor(story.genre)[0], colors.bg]} style={s.top}>
          <StoryCover
            title={story.title} genre={story.genre} author={story.author} width={160}
            imageUrl={gutenbergCover(story.coverUrl)}
          />
        </LinearGradient>

        <View style={{ paddingHorizontal: space.md }}>
          <Text style={s.title}>{story.title}</Text>
          <Pressable onPress={() => router.push(`/author/${story.authorId}`)}>
            <Text style={s.author}>by {story.author.split('(')[0].trim()}</Text>
          </Pressable>

          <View style={s.stats}>
            <Stat label="Reads" value={formatReads(story.reads)} />
            <Stat label="Status" value={story.status.split('/')[1]?.trim() ?? story.status} />
            <Stat label="Progress" value={`${pct}%`} />
          </View>

          <View style={s.chips}>
            {story.genres.map(g => (
              <Pressable key={g} style={s.chip} onPress={() => router.push(`/genre/${encodeURIComponent(g)}`)}>
                <Text style={s.chipText}>{g}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={s.sectionTitle}>Synopsis</Text>
          <Text style={s.synopsis}>{story.synopsis}</Text>
        </View>
      </ScrollView>

      <View style={s.bar}>
        <Pressable style={s.saveBtn} onPress={() => toggleSave(story.id)}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? colors.accent : colors.text} />
        </Pressable>
        <Pressable style={s.readBtn} onPress={() => router.push(`/read/${story.id}`)}>
          <Text style={s.readText}>{pct > 0 && pct < 100 ? 'Continue reading' : 'Start reading'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ color: colors.text, fontFamily: 'Inter_700Bold', fontSize: 16 }}>{value}</Text>
    <Text style={{ color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 }}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  top: { alignItems: 'center', paddingTop: 20, paddingBottom: 30 },
  title: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 28, textAlign: 'center' },
  author: { color: colors.accent, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: 6 },
  stats: { flexDirection: 'row', marginVertical: 22, paddingVertical: 14, backgroundColor: colors.surface, borderRadius: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { backgroundColor: colors.surface2, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  chipText: { color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 12 },
  sectionTitle: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 20, marginTop: 26, marginBottom: 8 },
  synopsis: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24 },
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12,
    padding: space.md, paddingBottom: 28, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  saveBtn: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  readBtn: { flex: 1, height: 54, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  readText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
});