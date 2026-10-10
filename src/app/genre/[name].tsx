import { Text, FlatList, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getGenreStories } from '@/api/stories';
import { useFetch } from '@/hooks/useFetch';
import StoryCard from '@/components/StoryCard';
import Center from '@/components/Center';
import { colors, space } from '@/constants/tokens';

export default function GenreScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const genre = decodeURIComponent(name);
  const { data, loading, error, reload } = useFetch(() => getGenreStories(genre), [genre]);
  const { width } = useWindowDimensions();
  const cardW = (width - space.md * 2 - 14) / 2;

  if (loading) return <Center spinner text="Loading…" />;
  if (error || !data) return <Center text={error ?? 'Error'} onRetry={reload} />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={data}
      numColumns={2}
      keyExtractor={i => `${i.id}`}
      columnWrapperStyle={{ gap: 14, paddingHorizontal: space.md }}
      contentContainerStyle={{ gap: 22, paddingBottom: 40 }}
      ListHeaderComponent={
        <Text style={{ color: colors.text, fontFamily: 'Lora_700Bold', fontSize: 28, margin: space.md }}>{genre}</Text>
      }
      renderItem={({ item }) => <StoryCard story={item} width={cardW} />}
    />
  );
}