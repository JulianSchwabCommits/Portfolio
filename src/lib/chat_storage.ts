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
        visitor_ip: await getVisitorIP(),
        user_agent: navigator.userAgent
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating chat conversation:', error);
    return null;
  }
};

// Save a message to a conversation
export const saveChatMessage = async (
  conversationId: string,
  message: { text: string; sender: 'user' | 'bot' }
): Promise<boolean> => {
  try {
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
    
    // Save all messages
    const messagePromises = messages.map(msg => 
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
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}; 