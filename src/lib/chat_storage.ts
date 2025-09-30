// Chat storage disabled - database operations moved to server-side
// This functionality would require implementing secure chat API endpoints

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// Create a new conversation and return its ID
export const createChatConversation = async (): Promise<string | null> => {
  try {
    // TODO: Implement secure chat conversation API endpoint in data.js
    console.warn('Chat conversation creation disabled - requires secure API implementation');
    
    // Generate a temporary local ID for now
    return Math.random().toString(36).substring(2, 15);
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
    
    // TODO: Implement secure chat message API endpoint in data.js
    console.warn('Chat message saving disabled - requires secure API implementation');
    
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
    // TODO: Implement secure conversation history API endpoint in data.js
    console.warn('Conversation history saving disabled - requires secure API implementation');
    
    return true;
  } catch (error) {
    console.error('Error saving conversation history:', error);
    return false;
  }
};

// Get visitor IP address (server-side only now)
const getVisitorIP = async (): Promise<string> => {
  try {
    // IP detection moved to server-side for security
    return 'anonymous';
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}; 