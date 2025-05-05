import { supabase } from './supabase';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// Create a new conversation and return its ID
export const createChatConversation = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        visitor_ip: 'anonymous', // Use a fixed value instead of getting IP
        user_agent: navigator.userAgent,
        is_active: true
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id as string;
  } catch (error) {
    console.error('Error creating chat conversation:', error);
    return null;
  }
};

// Save a message to a conversation
export const saveChatMessage = async (
  conversationId: string,
  message: { text: string; sender: 'user' | 'bot' },
  isFirstMessage: boolean = false
): Promise<boolean> => {
  try {
    // Skip saving if it's the first message
    if (isFirstMessage) {
      console.log('Skipping save for first welcome message');
      return true;
    }
    
    // 1. Insert the message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        content: message.text,
        sender: message.sender
      });
    
    if (messageError) throw messageError;
    
    // 2. Update the last_message_at timestamp
    const { error: updateError } = await supabase
      .from('chat_conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
};

// Save a full conversation history
export const saveConversationHistory = async (messages: Message[]): Promise<boolean> => {
  if (messages.length === 0) return false;
  
  try {
    // Create a new conversation
    const conversationId = await createChatConversation();
    if (!conversationId) return false;
    
    // Skip the first message and save the rest
    const messagesToSave = messages.slice(1);
    
    if (messagesToSave.length === 0) return true; // No messages to save after skipping first
    
    // Save all messages except the first one
    const messagePromises = messagesToSave.map(msg => 
      saveChatMessage(conversationId, {
        text: msg.text,
        sender: msg.sender
      })
    );
    
    await Promise.all(messagePromises);
    return true;
  } catch (error) {
    console.error('Error saving conversation history:', error);
    return false;
  }
};

// Get visitor IP address
const getVisitorIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json() as { ip: string };
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}; 