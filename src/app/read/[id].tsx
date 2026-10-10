import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChapters } from '@/api/stories';
import { useFetch } from '@/hooks/useFetch';
import { useLibrary } from '@/context/LibraryContext';
import Center from '@/components/Center';
import { readerThemes, colors } from '@/constants/tokens';

type ThemeKey = keyof typeof readerThemes;

export default function Reader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Number(id);
  const { data: chapters, loading, error, reload } = useFetch(() => getChapters(storyId), [id]);
  const { setProgress } = useLibrary();

  const [theme, setTheme] = useState<ThemeKey>('night');
  const [size, setSize] = useState(18);
  const [pct, setPct] = useState(0);
  const pctRef = useRef(0);

  // Save progress when leaving the reader
  useEffect(() => () => setProgress(storyId, pctRef.current), [storyId]); // eslint-disable-line

  if (loading) return <Center spinner text="Opening chapter…" />;
  if (error || !chapters?.length) return <Center text={error ?? 'No chapter found'} onRetry={reload} />;

  const chapter = chapters[0]; // each story has one chapter for now
  const t = readerThemes[theme];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ height: 3, width: `${pct}%`, backgroundColor: colors.accent }} />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, padding: 12 }}>
        {(Object.keys(readerThemes) as ThemeKey[]).map(k => (
          <Pressable key={k} onPress={() => setTheme(k)}
            style={{
              width: 24, height: 24, borderRadius: 12, backgroundColor: readerThemes[k].bg,
              borderWidth: 2, borderColor: theme === k ? colors.accent : '#888',
            }} />
        ))}
        <Pressable onPress={() => setSize(v => Math.max(14, v - 2))}>
          <Text style={{ color: t.text, fontFamily: 'Inter_600SemiBold' }}>A−</Text>
        </Pressable>
        <Pressable onPress={() => setSize(v => Math.min(30, v + 2))}>
          <Text style={{ color: t.text, fontFamily: 'Inter_600SemiBold' }}>A+</Text>
        </Pressable>
      </View>

      <ScrollView
        scrollEventThrottle={32}
        onScroll={e => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const max = contentSize.height - layoutMeasurement.height;
          const p = max > 0 ? Math.min(100, (contentOffset.y / max) * 100) : 0;
          pctRef.current = p;
          setPct(p);
        }}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      >
        <Text style={{ color: t.text, fontFamily: 'Lora_700Bold', fontSize: size + 10, marginBottom: 24 }}>
          {chapter.title}
        </Text>
        {chapter.paragraphs.map((p, i) => (
          <Text key={i} style={{ color: t.text, fontFamily: 'Lora_400Regular', fontSize: size, lineHeight: size * 1.7, marginBottom: 16 }}>
            {p}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}