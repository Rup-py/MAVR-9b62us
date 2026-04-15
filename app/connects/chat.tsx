import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { MOCK_CHAT_MESSAGES, ChatMessage } from '@/services/mockData';
import { AvatarFrame } from '@/components';

export default function ChatScreen() {
  const { partnerId, partnerName } = useLocalSearchParams<{ partnerId: string; partnerName: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(
    MOCK_CHAT_MESSAGES[partnerId] || []
  );
  const [input, setInput] = useState('');
  const [sameGymActive, setSameGymActive] = useState(partnerId === 'gp_001');

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/community');
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate reply after delay
    if (messages.length % 3 === 0) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `m${Date.now()}_r`,
          senderId: partnerId,
          text: ['Got it bro!', 'Sure, see you there.', 'On my way.', 'Let us crush it today.'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          isMe: false,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    }
  };

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.Background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={handleBack} hitSlop={16} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={28} color={Colors.TextPrimary} />
        </Pressable>
        <AvatarFrame letter={(partnerName || 'P').charAt(0)} tier="core" size={36} animated />
        <View style={{ flex: 1 }}>
          <Text style={styles.partnerName}>{partnerName}</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Online</Text>
            {sameGymActive && (
              <>
                <View style={styles.dot} />
                <MaterialIcons name="sync" size={12} color="#22C55E" />
                <Text style={[styles.statusText, { color: '#22C55E' }]}>Gym Sync Active</Text>
              </>
            )}
          </View>
        </View>
        <Pressable style={styles.moreBtn}>
          <MaterialIcons name="more-vert" size={22} color={Colors.TextSecondary} />
        </Pressable>
      </View>

      {/* Gym Sync Banner */}
      {sameGymActive && (
        <View style={styles.gymSyncBanner}>
          <MaterialIcons name="location-on" size={14} color="#22C55E" />
          <Text style={styles.gymSyncText}>Both at Fitness First, Andheri — Workout logs synced</Text>
          <Pressable onPress={() => setSameGymActive(false)}>
            <MaterialIcons name="close" size={14} color={Colors.TextMuted} />
          </Pressable>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrap, item.isMe && styles.bubbleWrapMe]}>
            {!item.isMe && (
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{(partnerName || 'P').charAt(0)}</Text>
              </View>
            )}
            <View style={[styles.bubble, item.isMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, item.isMe && { color: '#fff' }]}>{item.text}</Text>
              <Text style={[styles.bubbleTime, item.isMe && { color: 'rgba(255,255,255,0.6)' }]}>{item.timestamp}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <MaterialIcons name="chat-bubble-outline" size={36} color={Colors.TextMuted} />
            <Text style={styles.emptyChatText}>Start the conversation</Text>
          </View>
        }
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={Colors.TextMuted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
        </View>
        <Pressable
          style={[styles.sendBtn, input.trim().length > 0 && styles.sendBtnActive]}
          onPress={sendMessage}
        >
          <MaterialIcons name="send" size={20} color={input.trim().length > 0 ? '#fff' : Colors.TextMuted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.SurfaceBorder,
    backgroundColor: Colors.Background,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.SurfaceElevated, borderRadius: Radius.md },
  partnerName: { fontSize: FontSize.md, color: Colors.TextPrimary, fontWeight: FontWeight.bold },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22C55E' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.TextMuted },
  statusText: { fontSize: FontSize.xs, color: Colors.TextMuted },
  moreBtn: { padding: 4 },

  gymSyncBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#22C55E15', paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#22C55E33',
  },
  gymSyncText: { flex: 1, fontSize: FontSize.xs, color: '#22C55E', fontWeight: FontWeight.medium },

  messageList: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleWrapMe: { flexDirection: 'row-reverse' },
  avatarSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.Primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarSmallText: { fontSize: FontSize.xs, color: '#fff', fontWeight: FontWeight.black },
  bubble: {
    maxWidth: '72%', borderRadius: 16, padding: Spacing.md, gap: 4,
  },
  bubbleMe: { backgroundColor: Colors.Primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.SurfaceCard, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.SurfaceBorder },
  bubbleText: { fontSize: FontSize.md, color: Colors.TextPrimary, lineHeight: 20 },
  bubbleTime: { fontSize: 10, color: Colors.TextMuted, alignSelf: 'flex-end' },

  emptyChat: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl },
  emptyChatText: { fontSize: FontSize.md, color: Colors.TextMuted },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: Colors.SurfaceBorder,
    backgroundColor: Colors.Background,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.SurfaceCard, borderRadius: 24,
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    minHeight: 44, maxHeight: 120,
  },
  input: { fontSize: FontSize.md, color: Colors.TextPrimary },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.SurfaceCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.SurfaceBorder,
  },
  sendBtnActive: { backgroundColor: Colors.Primary, borderColor: Colors.Primary },
});
