import { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAuthors, getAuthorStories } from '@/api/stories';
import { wikimediaImage } from '@/utils/images';
import { useFetch } from '@/hooks/useFetch';
import StoryCard from '@/components/StoryCard';
import Center from '@/components/Center';
import { colors, space } from '@/constants/tokens';

export default function AuthorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: author, loading, error, reload } = useFetch(
    async () => (await getAuthors()).find(a => a.id === Number(id)) ?? null, [id]);
  const { data: stories } = useFetch(() => getAuthorStories(Number(id)), [id]);
  const [photoFailed, setPhotoFailed] = useState(false); // hooks must stay above the early returns
  const { width } = useWindowDimensions();
  const cardW = (width - space.md * 2 - 14) / 2;

  if (loading) return <Center spinner text="Loading…" />;
  if (error || !author) return <Center text={error ?? 'Author not found'} onRetry={reload} />;

  const initials = author.name.split('(')[0].trim().split(' ').map(w => w[0]).slice(0, 2).join('');
  const photo = wikimediaImage(author.photo, 300);

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={stories ?? []}
      numColumns={2}
      keyExtractor={i => `${i.id}`}
      columnWrapperStyle={{ gap: 14, paddingHorizontal: space.md }}
      contentContainerStyle={{ gap: 22, paddingBottom: 40 }}
      ListHeaderComponent={
        <View style={{ alignItems: 'center', padding: space.md, marginBottom: 8 }}>
          {photo && !photoFailed ? (
            <Image
              source={{ uri: photo }}
              onError={() => setPhotoFailed(true)}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View style={s.avatar}><Text style={s.initials}>{initials}</Text></View>
          )}
          <Text style={s.name}>{author.name.split('(')[0].trim()}</Text>
          <Text style={s.bio}>{author.bio}</Text>
          <Text style={s.section}>Stories</Text>
        </View>
      }
      renderItem={({ item }) => <StoryCard story={item} width={cardW} />}
    />
  );
}

const s = StyleSheet.create({
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontFamily: 'Lora_700Bold', fontSize: 30 },
  name: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 24, marginTop: 14, textAlign: 'center' },
  bio: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, marginTop: 10, textAlign: 'center' },
  section: { color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 20, alignSelf: 'flex-start', marginTop: 28 },
});