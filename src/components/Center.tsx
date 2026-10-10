import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/tokens';

export default function Center({ text, onRetry, spinner }: { text: string; onRetry?: () => void; spinner?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {spinner && <ActivityIndicator color={colors.accent} style={{ marginBottom: 12 }} />}
      <Text style={{ color: colors.muted, fontFamily: 'Inter_400Regular', textAlign: 'center' }}>{text}</Text>
      {onRetry && (
        <Pressable onPress={onRetry}>
          <Text style={{ color: colors.accent, fontFamily: 'Inter_600SemiBold', marginTop: 14 }}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}