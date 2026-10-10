import { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientFor, radius, colors } from '@/constants/tokens';

type Props = { title: string; genre: string; author: string; width?: number; imageUrl?: string | null };

export default function StoryCover({ title, genre, author, width = 130, imageUrl }: Props) {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        onError={() => setFailed(true)}
        resizeMode="cover"
        style={{ width, height: width * 1.5, borderRadius: radius.sm, backgroundColor: colors.surface2 }}
      />
    );
  }

  return (
    <LinearGradient
      colors={gradientFor(genre)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[s.cover, { width, height: width * 1.5 }]}
    >
      <View style={s.spine} />
      <Text style={[s.title, { fontSize: width * 0.14 }]} numberOfLines={4}>{title}</Text>
      <Text style={[s.author, { fontSize: width * 0.085 }]} numberOfLines={1}>
        {author.split('(')[0].trim()}
      </Text>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  cover: {
    borderRadius: radius.sm,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: 'rgba(0,0,0,0.25)' },
  title: { color: '#fff', fontFamily: 'Lora_700Bold', marginLeft: 6 },
  author: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_500Medium', marginLeft: 6 },
});