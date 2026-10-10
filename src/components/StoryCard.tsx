import { Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import StoryCover from './StoryCover';
import { Story, formatReads } from '@/api/stories';
import { colors } from '@/constants/tokens';

export default function StoryCard({ story, width = 130 }: { story: Story; width?: number }) {
  return (
    <Pressable onPress={() => router.push(`/story/${story.id}`)} style={{ width }}>
      <StoryCover title={story.title} genre={story.genre} author={story.author} width={width} />
      <Text style={s.title} numberOfLines={2}>{story.title}</Text>
      <Text style={s.meta}>{formatReads(story.reads)} reads</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  title: { color: colors.text, fontFamily: 'Inter_600SemiBold', marginTop: 10, fontSize: 14 },
  meta: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
});