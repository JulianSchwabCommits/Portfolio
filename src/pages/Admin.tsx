import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Database, MessageSquare, Search, ChevronRight, ChevronDown, Table2, BarChart3, PieChart as LucidePieChart, TrendingUp, Clock, Calendar, Users, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Scatter,
  ScatterChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// Enhanced interface for page views with additional tracking data
interface PageView {
  id: string;
  page_path: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
  operating_system?: string;
  country?: string;
  city?: string;
  referrer_source?: string;
  screen_size?: string;
  entry_url?: string;
  locale?: string;
  session_id: string;
  is_bounce: boolean;
  session_duration: number;
  viewed_at: string;
}

// Enhanced interface for user interactions with detailed tracking
interface UserInteraction {
  id: string;
  action_type: string;
  page_path: string;
  ip_address?: string;
  user_agent?: string;
  session_id: string;
  element_id?: string;
  element_class?: string;
  element_type?: string;
  x_position?: number;
  y_position?: number;
  value?: string;
  scroll_depth?: number;
  time_spent?: number;
  created_at: string;
}

// Enhanced interface for chat conversations with detailed tracking
interface ChatConversation {
  id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  session_id: string;
  locale?: string;
  initial_page?: string;
  satisfaction_rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  message_count?: number;
  user_id?: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  content: string;
  sender: string;
  is_first_message: boolean;
  created_at: string;
}

interface Table {
  name: string;
  schema: string;
}

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  table_name: string;
}

// Interface for analytics metrics
interface AnalyticsMetrics {
  unique_visitors: number;
  total_page_views: number;
  avg_session_duration: number;
  bounce_rate: number;
  unique_prev_period: number;
  views_prev_period: number;
  duration_prev_period: number;
  bounce_prev_period: number;
  mobile_percentage: number;
  desktop_percentage: number;
  avg_pages_per_visit: number;
}

// Interface for daily visitor data
interface DailyVisitorData {
  day: string;
  visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_duration: number;
}

// Interface for chart data points
interface ChartDataPoint {
  name: string;
  value: number;
}

// Interface for weekly visitor data
interface WeeklyVisitorData {
  week_start: string;
  visitors: number;
}

// Interface for time on site data
interface TimeOnSiteData {
  name: string;
  value: number;
}

// Interface for visitor engagement levels
interface VisitorEngagementData {
  name: string;
  value: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [tableColumns, setTableColumns] = useState<Column[]>([]);
  const [currentTable, setCurrentTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string>('');
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
  const [chatFilter, setChatFilter] = useState('all');
  const [chatSearch, setChatSearch] = useState('');
  const [showSchema, setShowSchema] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState<string>('week');
  
  // Analytics state variables
  const [analyticsMetrics, setAnalyticsMetrics] = useState<AnalyticsMetrics | null>(null);
  const [dailyVisitorData, setDailyVisitorData] = useState<DailyVisitorData[]>([]);
  const [trafficSourcesData, setTrafficSourcesData] = useState<ChartDataPoint[]>([]);
  const [deviceDistributionData, setDeviceDistributionData] = useState<ChartDataPoint[]>([]);
  const [browserUsageData, setBrowserUsageData] = useState<ChartDataPoint[]>([]);
  const [operatingSystemsData, setOperatingSystemsData] = useState<ChartDataPoint[]>([]);
  const [topPagesData, setTopPagesData] = useState<ChartDataPoint[]>([]);
  const [interactionTypesData, setInteractionTypesData] = useState<ChartDataPoint[]>([]);
  const [visitorCountriesData, setVisitorCountriesData] = useState<ChartDataPoint[]>([]);
  const [weeklyVisitorsData, setWeeklyVisitorsData] = useState<WeeklyVisitorData[]>([]);
  const [timeOnSiteData, setTimeOnSiteData] = useState<TimeOnSiteData[]>([]);
  const [visitorEngagementData, setVisitorEngagementData] = useState<VisitorEngagementData[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Handle redirect inside useEffect to fix React Router warning
    if (!isAuthenticated && sessionStorage.getItem('admin_auth') === null) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const checkAuth = async () => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth) {
      setIsAuthenticated(true);
      
      fetchAnalyticsData('week'); // Default to week view
      fetchTables();
      fetchChatConversations();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [viewsResult, interactionsResult] = await Promise.all([
        supabase
          .from('page_views')
          .select('*')
          .order('viewed_at', { ascending: false })
          .limit(100),
        supabase
          .from('user_interactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      if (viewsResult.data) {
        setPageViews(viewsResult.data.map(view => ({
          id: String(view.id || ''),
          page_path: String(view.page_path || ''),
          ip_address: String(view.ip_address || ''),
          user_agent: String(view.user_agent || ''),
          referrer: String(view.referrer || 'direct'),
          device_type: String(view.device_type || detectDevice(String(view.user_agent || ''))),
          browser: String(view.browser || detectBrowser(String(view.user_agent || ''))),
          country: String(view.country || 'Unknown'),
          city: String(view.city || 'Unknown'),
          session_id: String(view.session_id || ''),
          is_bounce: Boolean(view.is_bounce || false),
          session_duration: Number(view.session_duration || 0),
          viewed_at: String(view.viewed_at || ''),
          operating_system: String(view.operating_system || 'Unknown'),
          screen_size: String(view.screen_size || 'Unknown'),
          entry_url: String(view.entry_url || ''),
          locale: String(view.locale || 'Unknown'),
          referrer_source: String(view.referrer_source || 'Unknown')
        })));
      }
      if (interactionsResult.data) {
        setInteractions(interactionsResult.data.map(interaction => ({
          id: String(interaction.id || ''),
          action_type: String(interaction.action_type || ''),
          page_path: String(interaction.page_path || ''),
          ip_address: String(interaction.ip_address || ''),
          user_agent: String(interaction.user_agent || ''),
          session_id: String(interaction.session_id || ''),
          element_id: String(interaction.element_id || ''),
          element_class: String(interaction.element_class || ''),
          element_type: String(interaction.element_type || ''),
          x_position: Number(interaction.x_position || 0),
          y_position: Number(interaction.y_position || 0),
          value: String(interaction.value || ''),
          scroll_depth: Number(interaction.scroll_depth || 0),
          time_spent: Number(interaction.time_spent || 0),
          created_at: String(interaction.created_at || '')
        })));
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      // We have direct errors accessing information_schema and RPCs, so let's use
      // a simpler approach that only checks known tables

      // Define tables that we know exist in the portfolio project
      const knownTables = [
        'page_views', 
        'user_interactions', 
        'chat_conversations', 
        'chat_messages', 
        'admin_users',
        'projects',
        'experiences'
      ];
      
      const foundTables: Table[] = [];
      setLoading(true);
      
      // Try each table one by one
      for (const tableName of knownTables) {
        try {
          const { data, error } = await supabase.from(tableName).select('*').limit(1);
          
          // If we don't get an error, the table exists
          if (!error) {
            foundTables.push({ name: tableName, schema: 'public' });
            console.log(`Found table: ${tableName}`);
          }
        } catch (e) {
          console.log(`Table ${tableName} not accessible`);
        }
      }
      
      if (foundTables.length > 0) {
        // Sort tables alphabetically
        const sortedTables = foundTables.sort((a, b) => a.name.localeCompare(b.name));
        setTables(sortedTables);
        
        // Select first table if none selected
        if (!currentTable) {
          handleTableSelect(sortedTables[0].name);
        }
      } else {
        console.error('No tables found or accessible');
      }
    } catch (err) {
      console.error('Error fetching database tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableSchema = async (tableName: string) => {
    try {
      setLoading(true);
      
      // Try to fetch schema directly first
      const schema = await fetchTableSchemaDirect(tableName);
      
      if (schema && schema.length > 0) {
        setTableColumns(schema);
        return;
      }
      
      // Fallback: Try to infer schema from data
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const inferredColumns: Column[] = Object.entries(data[0]).map(([name, value]) => {
          // Handle type detection
          let dataTypeString: string = typeof value;
          
          // We need to cast these special types as strings to avoid TypeScript errors
          if (value instanceof Date) {
            dataTypeString = "date" as any;
          } else if (Array.isArray(value)) {
            dataTypeString = "array" as any;
          } else if (value === null) {
            dataTypeString = "unknown" as any;
          }
          
          return {
            column_name: name,
            data_type: dataTypeString,
            is_nullable: 'YES', // Assuming nullable by default
            table_name: tableName
          };
        });
        
        setTableColumns(inferredColumns);
      } else {
        setTableColumns([]);
      }
    } catch (error) {
      console.error(`Error fetching schema for ${tableName}:`, error);
      setTableColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = async (tableName: string) => {
    try {
      // Toggle schema view if selecting the same table
      if (currentTable === tableName) {
        setCurrentTable(null);
        setTableColumns([]);
        setTableData([]);
      return;
    }

      // Set the current table and show schema
    setCurrentTable(tableName);
    setLoading(true);
    
      // Fetch the table schema
      await fetchTableSchema(tableName);
      
      // Fetch data from the table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
              setTableData([]);
      } else {
        setTableData(data || []);
      }
    } catch (error) {
      console.error('Error in handleTableSelect:', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatConversations = async () => {
    try {
      // Get chat conversations with message count
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          message_count:chat_messages(count)
        `)
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to include message count
      if (data) {
        const conversations = data.map(conv => ({
          ...conv,
          message_count: conv.message_count && 
            Array.isArray(conv.message_count) && 
            conv.message_count[0] ? 
            Number(conv.message_count[0].count) : 0
        })) as ChatConversation[];
        
        setChatConversations(conversations);
      }
    } catch (err) {
      console.error('Error fetching chat conversations:', err);
      setChatConversations([]);
    }
  };

  const handleConversationSelect = async (conversationId: string) => {
    setCurrentConversation(conversationId);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setConversationMessages(data.map(msg => ({
          id: String(msg.id || ''),
          conversation_id: String(msg.conversation_id || ''),
          content: String(msg.content || ''),
          sender: msg.sender === 'user' || msg.sender === 'bot' ? 'user' : 'bot',
          is_first_message: msg.is_first_message === true,
          created_at: String(msg.created_at || '')
        })));
      }
    } catch (err) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, err);
      setConversationMessages([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentTable) return;
    
    try {
      const { error } = await supabase
        .from(currentTable)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data after deletion
      handleTableSelect(currentTable);
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting item:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({...item});
  };

  const handleSaveEdit = async () => {
    if (!currentTable || !editingItem) return;
    
    try {
      const { error } = await supabase
        .from(currentTable)
        .update(editingItem)
        .eq('id', editingItem.id);
      
      if (error) throw error;
      
      // Refresh data after update
      handleTableSelect(currentTable);
      setEditingItem(null);
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
    } catch (err) {
      console.error('Error updating item:', err);
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const renderEditForm = () => {
    if (!editingItem) return null;
    
    return (
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(editingItem).map(key => 
              key !== 'id' ? (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={key} className="text-right">{key}</label>
                  <Input
                    id={key}
                    value={editingItem[key] || ''}
                    onChange={(e) => setEditingItem({...editingItem, [key]: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              ) : null
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data and reset current conversation if needed
      fetchChatConversations();
      if (currentConversation === id) {
        setCurrentConversation('');
        setConversationMessages([]);
      }
      
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting conversation:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    }
  };

  const filterChatConversations = () => {
    let filtered = [...chatConversations];
    
    // Apply active/inactive filter
    if (chatFilter === 'active') {
      filtered = filtered.filter(conv => conv.is_active);
    } else if (chatFilter === 'inactive') {
      filtered = filtered.filter(conv => !conv.is_active);
    }
    
    // Apply search filter if there's a search term
    if (chatSearch) {
      const searchLower = chatSearch.toLowerCase();
      filtered = filtered.filter(conv => 
        (conv.session_id && conv.session_id.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  };

  const handleLogout = () => {
    try {
      // Clear session storage
      sessionStorage.removeItem('admin_auth');
      
      // Reset all state
      setIsAuthenticated(false);
      setPageViews([]);
      setInteractions([]);
      setTables([]);
      setTableColumns([]);
      setCurrentTable('');
      setTableData([]);
      setEditingItem(null);
      setChatConversations([]);
      setCurrentConversation('');
      setConversationMessages([]);
      setChatFilter('all');
      setChatSearch('');
      setShowSchema(false);
      
      // Force redirect
      window.location.href = '/admin';
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Function to directly fetch table schema using SQL
  const fetchTableSchemaDirect = async (tableName: string): Promise<Column[]> => {
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, table_name')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');
      
      if (error) {
        console.error('Error fetching schema directly:', error);
        return [];
      }
      
      if (data && data.length > 0) {
        return data as Column[];
      }
      
      return [];
    } catch (error) {
      console.error('Exception fetching schema directly:', error);
      
      // Try to infer schema from data
      try {
        const { data: sampleData } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
        if (sampleData && sampleData.length > 0) {
          return Object.entries(sampleData[0]).map(([name, value]) => {
            // Handle type detection
            let dataTypeString: string = typeof value;
            
            // We need to cast these special types as strings to avoid TypeScript errors
            if (value instanceof Date) {
              dataTypeString = "date" as any;
            } else if (Array.isArray(value)) {
              dataTypeString = "array" as any;
            } else if (value === null) {
              dataTypeString = "unknown" as any;
            }
            
            return {
              column_name: name,
              data_type: dataTypeString,
              is_nullable: 'YES',
              table_name: tableName
            };
          });
        }
      } catch (innerError) {
        console.error('Error inferring schema from data:', innerError);
      }
      
      return [];
    }
  };

  // Format duration in seconds to readable format
  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0s";
    
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  // Helper function to calculate the growth indicator (positive or negative)
  const getGrowthIndicator = (current: number, previous: number): string => {
    if (!previous) return "neutral";
    return current >= previous ? "positive" : "negative";
  }
  
  // Get total unique visitors
  const getUniqueVisitors = (): number => {
    return analyticsMetrics?.unique_visitors || 0;
  };

  // Get total page views
  const getTotalPageViews = (): number => {
    return analyticsMetrics?.total_page_views || 0;
  };

  // Calculate average session duration (if you have session data)
  const getAverageSessionDuration = (): string => {
    return formatDuration(analyticsMetrics?.avg_session_duration || 0);
  };

  // Calculate bounce rate (if you have session data)
  const getBounceRate = (): string => {
    return `${Math.round(analyticsMetrics?.bounce_rate || 0)}%`;
  };
  
  // Get average pages per visit
  const getAvgPagesPerVisit = (): string => {
    return (analyticsMetrics?.avg_pages_per_visit || 0).toFixed(1);
  };
  
  // Calculate visitor growth percentage
  const getVisitorGrowthPct = (): number => {
    if (!analyticsMetrics) return 0;
    
    const current = analyticsMetrics.unique_visitors || 0;
    const previous = analyticsMetrics.unique_prev_period || 0;
    
    if (previous === 0) return 100; // If no previous visitors, show 100% growth
    
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Calculate page view growth percentage
  const getPageViewGrowthPct = (): number => {
    if (!analyticsMetrics) return 0;
    
    const current = analyticsMetrics.total_page_views || 0;
    const previous = analyticsMetrics.views_prev_period || 0;
    
    if (previous === 0) return 100; // If no previous page views, show 100% growth
    
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Calculate bounce rate change
  const getBounceRateChange = (): number => {
    if (!analyticsMetrics) return 0;
    
    const current = analyticsMetrics.bounce_rate || 0;
    const previous = analyticsMetrics.bounce_prev_period || 0;
    
    return Math.round(current - previous);
  };
  
  // Calculate session duration change
  const getSessionDurationChange = (): number => {
    if (!analyticsMetrics) return 0;
    
    const current = analyticsMetrics.avg_session_duration || 0;
    const previous = analyticsMetrics.duration_prev_period || 0;
    
    if (previous === 0) return 100;
    
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Calculate mobile percentage
  const getMobilePercentage = (): string => {
    return `${Math.round(analyticsMetrics?.mobile_percentage || 0)}%`;
  };
  
  // Calculate desktop percentage
  const getDesktopPercentage = (): string => {
    return `${Math.round(analyticsMetrics?.desktop_percentage || 0)}%`;
  };

  // Add function to handle visitor growth trend
  const getWeeklyVisitorsTrend = async (weeks: number = 8) => {
    try {
      // Create a map of weeks
      const weekMap = new Map();
      for (let i = weeks - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const weekStart = date.toISOString().split('T')[0];
        weekMap.set(weekStart, {
          week_start: weekStart,
          visitors: 0
        });
      }
      
      // Get page views for the period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
      
      const { data, error } = await supabase
        .from('page_views')
        .select('session_id, viewed_at')
        .gte('viewed_at', cutoffDate.toISOString());
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Group by week
        const sessionsByWeek = new Map<string, Set<string>>();
        
        data.forEach((view) => {
          const viewDate = new Date(view.viewed_at);
          // Get the week start by finding the closest previous Sunday
          const dayOfWeek = viewDate.getDay(); // 0 is Sunday
          const daysToSubtract = dayOfWeek;
          const weekStartDate = new Date(viewDate);
          weekStartDate.setDate(viewDate.getDate() - daysToSubtract);
          const weekStart = weekStartDate.toISOString().split('T')[0];
          
          // Find the closest week in our map
          let closestWeek = null;
          let minDiff = Infinity;
          
          for (const [week] of weekMap) {
            const diff = Math.abs(new Date(week).getTime() - weekStartDate.getTime());
            if (diff < minDiff) {
              minDiff = diff;
              closestWeek = week;
            }
          }
          
          if (closestWeek) {
            if (!sessionsByWeek.has(closestWeek)) {
              sessionsByWeek.set(closestWeek, new Set());
            }
            sessionsByWeek.get(closestWeek)?.add(view.session_id);
            
            const weekData = weekMap.get(closestWeek);
            weekData.visitors = sessionsByWeek.get(closestWeek)?.size || 0;
            weekMap.set(closestWeek, weekData);
          }
        });
        
        return Array.from(weekMap.values())
          .map(item => ({
            ...item,
            week_start: format(new Date(item.week_start), 'MMM d')
          }));
      }
      
      // If no data, return empty weeks
      return Array.from(weekMap.values())
        .map(item => ({
          ...item,
          week_start: format(new Date(item.week_start), 'MMM d')
        }));
    } catch (err) {
      console.error('Error getting weekly visitors trend:', err);
      return [];
    }
  };

  // Modify the fetchAnalyticsData function to handle weekly visitor trend
  const fetchAnalyticsData = async (range: string = 'week') => {
    setLoading(true);
    
    try {
      // Determine number of days based on range
      let days = 7;
      if (range === 'day') days = 1;
      if (range === 'month') days = 30;
      if (range === 'quarter') days = 90;
      
      // Analytics metrics - fallback to direct query if RPC fails
      try {
        const metricsResult = await supabase.rpc('get_analytics_metrics', { days });
        if (metricsResult.error) throw metricsResult.error;
        
        if (metricsResult.data && Array.isArray(metricsResult.data) && metricsResult.data.length > 0) {
          setAnalyticsMetrics(metricsResult.data[0] as AnalyticsMetrics);
        }
      } catch (err) {
        console.log('Fallback to direct queries for metrics');
        // Set default metrics
        const defaultMetrics: AnalyticsMetrics = {
          unique_visitors: 0,
          total_page_views: 0,
          avg_session_duration: 0,
          bounce_rate: 0,
          unique_prev_period: 0,
          views_prev_period: 0,
          duration_prev_period: 0,
          bounce_prev_period: 0,
          mobile_percentage: 0,
          desktop_percentage: 0,
          avg_pages_per_visit: 0
        };
        
        try {
          // Get page views count and unique visitors
          const pageViewsData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at'
          });
          
          if (pageViewsData.length > 0) {
            const uniqueSessions = new Set(pageViewsData.map(view => view.session_id));
            defaultMetrics.unique_visitors = uniqueSessions.size;
            defaultMetrics.total_page_views = pageViewsData.length;
            
            // Calculate device percentages
            const deviceCounts = pageViewsData.reduce((acc: Record<string, number>, curr: any) => {
              const deviceType = curr.device_type || 'Desktop';
              acc[deviceType] = (acc[deviceType] || 0) + 1;
              return acc;
            }, {});
            
            const mobileCount = deviceCounts['Mobile'] || 0;
            const totalCount = pageViewsData.length;
            
            defaultMetrics.mobile_percentage = totalCount ? (mobileCount / totalCount) * 100 : 0;
            defaultMetrics.desktop_percentage = totalCount ? 
              ((deviceCounts['Desktop'] || 0) / totalCount) * 100 : 0;
            
            // Calculate average pages per visit
            if (uniqueSessions.size > 0) {
              defaultMetrics.avg_pages_per_visit = pageViewsData.length / uniqueSessions.size;
            }
          }
          
          setAnalyticsMetrics(defaultMetrics);
        } catch (e) {
          console.error('Failed even with fallback query for metrics', e);
          setAnalyticsMetrics(defaultMetrics);
        }
      }
      
      // Daily visitors chart - fallback to direct query
      try {
        const visitorsResult = await supabase.rpc('get_daily_visitors', { days });
        if (visitorsResult.error) throw visitorsResult.error;
        
        if (visitorsResult.data && Array.isArray(visitorsResult.data)) {
          // Format the date for display
          setDailyVisitorData(visitorsResult.data.map((item: any) => ({
            ...item,
            day: format(new Date(item.day), 'MMM d')
          })));
        }
      } catch (err) {
        console.log('Fallback to direct query for daily visitors');
        try {
          // Create a map of dates for the last N days
          const dateMap = new Map();
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap.set(dateStr, {
              day: dateStr,
              visitors: 0,
              page_views: 0,
              bounce_rate: 0,
              avg_duration: 0
            });
          }
          
          // Get page views grouped by day
          const pageViewsData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at'
          });
          
          // Process the data to calculate daily metrics
          const sessionsByDay = new Map<string, Set<string>>();
          
          pageViewsData.forEach((view: any) => {
            if (view && view.viewed_at) {
              const viewDate = new Date(view.viewed_at);
              const dateStr = viewDate.toISOString().split('T')[0];
              
              if (dateMap.has(dateStr)) {
                const dayData = dateMap.get(dateStr);
                dayData.page_views += 1;
                
                // Track unique visitors by session ID
                if (!sessionsByDay.has(dateStr)) {
                  sessionsByDay.set(dateStr, new Set());
                }
                sessionsByDay.get(dateStr)?.add(view.session_id);
                
                dayData.visitors = sessionsByDay.get(dateStr)?.size || 0;
                dateMap.set(dateStr, dayData);
              }
            }
          });
          
          const formattedData = Array.from(dateMap.values()).map(item => ({
            ...item,
            day: format(new Date(item.day as string), 'MMM d')
          }));
          
          setDailyVisitorData(formattedData);
        } catch (e) {
          console.error('Failed with fallback query for daily visitors', e);
          // Create empty data structure
          const emptyData = [];
          for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            emptyData.unshift({
              day: format(new Date(date), 'MMM d'),
              visitors: 0,
              page_views: 0,
              bounce_rate: 0,
              avg_duration: 0
            });
          }
          setDailyVisitorData(emptyData);
        }
      }
      
      // Traffic sources chart - fallback to direct query
      try {
        const sourcesResult = await supabase.rpc('get_traffic_sources');
        if (sourcesResult.error) throw sourcesResult.error;
        
        setTrafficSourcesData(sourcesResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for traffic sources');
        try {
          const directData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at',
            groupBy: 'referrer_source'
          });
          
          setTrafficSourcesData(directData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for traffic sources', e);
          setTrafficSourcesData([
            { name: 'Direct', value: 0 },
            { name: 'Search', value: 0 },
            { name: 'Social', value: 0 },
            { name: 'Referral', value: 0 }
          ]);
        }
      }
      
      // Device distribution chart - fallback to direct query
      try {
        const deviceResult = await supabase.rpc('get_device_distribution');
        if (deviceResult.error) throw deviceResult.error;
        
        setDeviceDistributionData(deviceResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for device distribution');
        try {
          const directData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at',
            groupBy: 'device_type'
          });
          
          setDeviceDistributionData(directData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for device distribution', e);
          setDeviceDistributionData([
            { name: 'Desktop', value: 0 },
            { name: 'Mobile', value: 0 },
            { name: 'Tablet', value: 0 }
          ]);
        }
      }
      
      // Browser usage chart - fallback to direct query
      try {
        const browserResult = await supabase.rpc('get_browser_usage');
        if (browserResult.error) throw browserResult.error;
        
        setBrowserUsageData(browserResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for browser usage');
        try {
          const directData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at',
            groupBy: 'browser'
          });
          
          setBrowserUsageData(directData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for browser usage', e);
          setBrowserUsageData([
            { name: 'Chrome', value: 0 },
            { name: 'Firefox', value: 0 },
            { name: 'Safari', value: 0 },
            { name: 'Edge', value: 0 }
          ]);
        }
      }
      
      // Operating systems chart - fallback to direct query
      try {
        const osResult = await supabase.rpc('get_operating_systems');
        if (osResult.error) throw osResult.error;
        
        setOperatingSystemsData(osResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for operating systems');
        try {
          const directData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at',
            groupBy: 'operating_system'
          });
          
          setOperatingSystemsData(directData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for operating systems', e);
          setOperatingSystemsData([
            { name: 'Windows', value: 0 },
            { name: 'MacOS', value: 0 },
            { name: 'Linux', value: 0 },
            { name: 'Android', value: 0 },
            { name: 'iOS', value: 0 }
          ]);
        }
      }
      
      // Top pages chart - fallback to direct query
      try {
        const pagesResult = await supabase.rpc('get_top_pages', { limit_count: 5 });
        if (pagesResult.error) throw pagesResult.error;
        
        setTopPagesData(pagesResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for top pages');
        try {
          const directData = await getDirectTableData('page_views', {
            days,
            timeField: 'viewed_at',
            groupBy: 'page_path',
            customQuery: (query) => query.order('viewed_at', { ascending: false }).limit(500)
          });
          
          // Sort and limit to top 5
          const sortedData = directData
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
            
          setTopPagesData(sortedData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for top pages', e);
          setTopPagesData([]);
        }
      }
      
      // Interaction types chart - fallback to direct query
      try {
        const interactionsResult = await supabase.rpc('get_interaction_types');
        if (interactionsResult.error) throw interactionsResult.error;
        
        setInteractionTypesData(interactionsResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('Fallback to direct query for interaction types');
        try {
          const directData = await getDirectTableData('user_interactions', {
            days,
            timeField: 'created_at',
            groupBy: 'action_type'
          });
          
          setInteractionTypesData(directData as ChartDataPoint[]);
        } catch (e) {
          console.error('Failed with fallback query for interaction types', e);
          setInteractionTypesData([]);
        }
      }
      
      // Visitor countries chart - fallback to direct query
      try {
        const countriesResult = await supabase.rpc('get_visitor_countries', { limit_count: 5 });
        if (countriesResult.error) throw countriesResult.error;
        
        setVisitorCountriesData(countriesResult.data as ChartDataPoint[]);
      } catch (err) {
        console.log('No country data available, skipping chart');
        setVisitorCountriesData([]);
      }
      
      // Store data for charts
      if (metricsData && Array.isArray(metricsData) && metricsData.length > 0) {
        setAnalyticsMetrics(metricsData[0] as AnalyticsMetrics);
      }
      
      if (visitorData && Array.isArray(visitorData)) {
        // Format the date for display
        setDailyVisitorData(visitorData.map((item: any) => ({
          ...item,
          day: format(new Date(item.day), 'MMM d')
        })));
      }
      
      if (sourcesData) setTrafficSourcesData(sourcesData as ChartDataPoint[]);
      if (deviceData) setDeviceDistributionData(deviceData as ChartDataPoint[]);
      if (browserData) setBrowserUsageData(browserData as ChartDataPoint[]);
      if (osData) setOperatingSystemsData(osData as ChartDataPoint[]);
      if (pagesData) setTopPagesData(pagesData as ChartDataPoint[]);
      if (interactionData) setInteractionTypesData(interactionData as ChartDataPoint[]);
      if (countryData) setVisitorCountriesData(countryData as ChartDataPoint[]);
      
      setAnalyticsDateRange(range);
      
      // Get weekly visitor trend
      const weeklyData = await getWeeklyVisitorsTrend(8);
      if (weeklyData.length > 0) {
        setWeeklyVisitorsData(weeklyData);
      } else {
        setWeeklyVisitorsData([]);
      }
      
      // Generate placeholder time on site data
      const timeOnSiteData = [
        { name: '< 30 sec', value: 0 },
        { name: '30-60 sec', value: 0 },
        { name: '1-3 min', value: 0 },
        { name: '3-10 min', value: 0 },
        { name: '> 10 min', value: 0 }
      ];
      
      setTimeOnSiteData(timeOnSiteData as TimeOnSiteData[]);
      
      // Generate placeholder engagement data
      const engagementData = [
        { name: 'Single Page', value: 0 },
        { name: '2-3 Pages', value: 0 },
        { name: '4-7 Pages', value: 0 },
        { name: '8+ Pages', value: 0 }
      ];
      
      setVisitorEngagementData(engagementData as VisitorEngagementData[]);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      toast({
        title: "Error fetching analytics data",
        description: "Using fallback data instead of live analytics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Utility functions to extract more data
  const detectBrowser = (userAgent: string | undefined) => {
    if (!userAgent) return 'Other';
    
    const ua = userAgent.toLowerCase();
    
    if (ua.indexOf('chrome') > -1) return 'Chrome';
    if (ua.indexOf('safari') > -1) return 'Safari';
    if (ua.indexOf('firefox') > -1) return 'Firefox';
    if (ua.indexOf('edge') > -1) return 'Edge';
    if (ua.indexOf('opera') > -1 || ua.indexOf('opr') > -1) return 'Opera';
    if (ua.indexOf('msie') > -1 || ua.indexOf('trident') > -1) return 'Internet Explorer';
    
    return 'Other';
  };

  // Get page views by page using actual data
  const getPageViewsByPage = () => {
    const pageGroups: Record<string, number> = {};
    
    pageViews.forEach(view => {
      const path = view.page_path || '/';
      pageGroups[path] = (pageGroups[path] || 0) + 1;
    });
    
    return Object.entries(pageGroups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 pages
  };

  // Get views by day for chart
  const getViewsByDay = () => {
    // Create date map for last 7 days
    const dateMap = new Map();
    
    // Initialize the date map with zero counts
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        visitors: 0,
        pageViews: 0
      });
    }
    
    // Track unique visitors per day with Set
    const visitorsByDate = new Map<string, Set<string>>();
    
    // Populate with actual data
    pageViews.forEach(view => {
      const viewDate = new Date(view.viewed_at);
      viewDate.setHours(0, 0, 0, 0);
      const dateStr = viewDate.toISOString().split('T')[0];
      
      if (dateMap.has(dateStr)) {
        const dayData = dateMap.get(dateStr);
        dayData.pageViews += 1;
        
        // Track unique visitors by IP
        const visitors = visitorsByDate.get(dateStr) || new Set();
        visitors.add(view.ip_address || view.page_path);
        visitorsByDate.set(dateStr, visitors);
        
        // Update the visitor count
        dayData.visitors = visitors.size;
        dateMap.set(dateStr, dayData);
      }
    });
    
    // Convert map to array for chart
    return Array.from(dateMap.values());
  };

  // Get interactions by type from actual data
  const getInteractionsByType = () => {
    const interactionGroups: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      const type = interaction.action_type || 'unknown';
      interactionGroups[type] = (interactionGroups[type] || 0) + 1;
    });
    
    return Object.entries(interactionGroups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Get device breakdown from actual data
  const getDeviceTypes = () => {
    const deviceGroups: Record<string, number> = {
      'Mobile': 0,
      'Desktop': 0,
      'Tablet': 0,
      'Other': 0
    };
    
    // Track unique visitors
    const uniqueVisitors = new Map();
    
    pageViews.forEach(view => {
      // Only count each visitor once (by IP)
      if (!uniqueVisitors.has(view.ip_address || view.page_path)) {
        const deviceType = view.device_type || detectDevice(view.user_agent);
        deviceGroups[deviceType] = (deviceGroups[deviceType] || 0) + 1;
        uniqueVisitors.set(view.ip_address || view.page_path, deviceType);
      }
    });
    
    return Object.entries(deviceGroups)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  };

  // Get traffic sources breakdown
  const getTrafficSources = () => {
    const sourceGroups: Record<string, number> = {
      'Direct': 0,
      'Search': 0,
      'Social': 0,
      'Referral': 0,
      'Other': 0
    };
    
    // Helper to categorize traffic sources
    const categorizeSource = (referrer: string) => {
      if (!referrer || referrer === 'direct') return 'Direct';
      
      const ref = referrer.toLowerCase();
      if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo') || ref.includes('duckduckgo')) {
        return 'Search';
      } else if (
        ref.includes('facebook') || ref.includes('twitter') || ref.includes('instagram') || 
        ref.includes('linkedin') || ref.includes('pinterest') || ref.includes('reddit')
      ) {
        return 'Social';
      } else if (ref.includes('http') || ref.includes('www')) {
        return 'Referral';
      }
      
      return 'Other';
    };
    
    // Track unique visitors
    const uniqueVisitors = new Map();
    
    pageViews.forEach(view => {
      // Only count each visitor once
      if (!uniqueVisitors.has(view.ip_address || view.page_path)) {
        const sourceType = categorizeSource(view.referrer || 'direct');
        sourceGroups[sourceType] = (sourceGroups[sourceType] || 0) + 1;
        uniqueVisitors.set(view.ip_address || view.page_path, sourceType);
      }
    });
    
    return Object.entries(sourceGroups)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  };

  // Get visitor countries from actual data
  const getVisitorCountries = () => {
    const countryGroups: Record<string, number> = {};
    
    // Track unique visitors by country
    const uniqueVisitors = new Map();
    
    pageViews.forEach(view => {
      // Only count each visitor once
      if (!uniqueVisitors.has(view.ip_address || view.page_path)) {
        const country = view.country || 'Unknown';
        countryGroups[country] = (countryGroups[country] || 0) + 1;
        uniqueVisitors.set(view.ip_address || view.page_path, country);
      }
    });
    
    return Object.entries(countryGroups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 countries
  };

  // Get browser usage from actual data
  const getBrowserUsage = () => {
    const browserGroups: Record<string, number> = {};
    
    // Track unique visitors by browser
    const uniqueVisitors = new Map();
    
    pageViews.forEach(view => {
      // Only count each visitor once
      if (!uniqueVisitors.has(view.ip_address || view.page_path)) {
        const browser = view.browser || detectBrowser(view.user_agent);
        browserGroups[browser] = (browserGroups[browser] || 0) + 1;
        uniqueVisitors.set(view.ip_address || view.page_path, browser);
      }
    });
    
    return Object.entries(browserGroups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Add the detectDevice function that was missing
  const detectDevice = (userAgent: string | undefined) => {
    if (!userAgent) return 'Other';
    
    const ua = userAgent.toLowerCase();
    
    if (/(android|webos|iphone|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
      return 'Mobile';
    } else if (/(ipad|tablet)/i.test(ua)) {
      return 'Tablet';
    } else if (/(windows|macintosh|linux)/i.test(ua)) {
      return 'Desktop';
    } else {
      return 'Other';
    }
  };

  // Fallback function to get data directly from tables when RPC fails
  const getDirectTableData = async (tableName: string, options: {
    limit?: number,
    timeField?: string,
    days?: number,
    groupBy?: string,
    customQuery?: (query: any) => any
  } = {}): Promise<any[]> => {
    const { limit = 100, timeField = 'created_at', days = 30, groupBy, customQuery } = options;
    
    try {
      let query = supabase
        .from(tableName)
        .select('*');
      
      // Apply time filter if specified
      if (days > 0 && timeField) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte(timeField, cutoffDate.toISOString());
      }
      
      // Apply custom query modifications if provided
      if (customQuery) {
        query = customQuery(query);
      }
      
      // Apply limit
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Handle group by in JavaScript since we can't do it in the query
      if (groupBy && data) {
        const groupedData = data.reduce((acc: Record<string, any>, curr: any) => {
          const key = curr[groupBy] || 'Unknown';  // Handle null or undefined values
          if (!acc[key]) {
            acc[key] = { name: key, value: 0 };
          }
          acc[key].value += 1;
          return acc;
        }, {});
        
        return Object.values(groupedData);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Error fetching direct data from ${tableName}:`, err);
      return [];
    }
  };

  // Function to get weekly visitor data directly from database
  const fetchWeeklyVisitorsTrend = async (weeks: number = 8): Promise<WeeklyVisitorData[]> => {
    try {
      // Create a map of weeks
      const weekMap = new Map();
      for (let i = weeks - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const weekStart = date.toISOString().split('T')[0];
        weekMap.set(weekStart, {
          week_start: weekStart,
          visitors: 0
        });
      }
      
      // Get page views for the period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
      
      const { data, error } = await supabase
        .from('page_views')
        .select('session_id, viewed_at')
        .gte('viewed_at', cutoffDate.toISOString());
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Group by week
        const sessionsByWeek = new Map<string, Set<string>>();
        
        data.forEach((view) => {
          if (view && view.viewed_at) {
            const viewDate = new Date(view.viewed_at);
            // Get week start (Sunday)
            const dayOfWeek = viewDate.getDay(); // 0 is Sunday
            const daysToSubtract = dayOfWeek;
            const weekStartDate = new Date(viewDate);
            weekStartDate.setDate(viewDate.getDate() - daysToSubtract);
            const weekStart = weekStartDate.toISOString().split('T')[0];
            
            // Find the closest week in our map
            let closestWeek = null;
            let minDiff = Infinity;
            
            for (const [week] of weekMap) {
              const diff = Math.abs(new Date(week).getTime() - weekStartDate.getTime());
              if (diff < minDiff) {
                minDiff = diff;
                closestWeek = week;
              }
            }
            
            if (closestWeek) {
              if (!sessionsByWeek.has(closestWeek)) {
                sessionsByWeek.set(closestWeek, new Set());
              }
              
              if (view.session_id) {
                sessionsByWeek.get(closestWeek)?.add(view.session_id);
                
                const weekData = weekMap.get(closestWeek);
                weekData.visitors = sessionsByWeek.get(closestWeek)?.size || 0;
                weekMap.set(closestWeek, weekData);
              }
            }
          }
        });
      }
      
      // Format dates and return
      return Array.from(weekMap.values())
        .map(item => ({
          ...item,
          week_start: format(new Date(item.week_start), 'MMM d')
        }));
    } catch (err) {
      console.error('Error getting weekly visitors trend:', err);
      return [];
    }
  };

  if (!isAuthenticated) {
    // Don't navigate here, use the useEffect hook above
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchAnalyticsData(analyticsDateRange)}>
            Refresh Data
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="analytics">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 sm:gap-0">
          <TabsList className="flex flex-wrap justify-center w-full sm:w-auto">
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="database" className="text-xs sm:text-sm">Database</TabsTrigger>
            <TabsTrigger value="chat-history" className="text-xs sm:text-sm">Chat History</TabsTrigger>
          </TabsList>
          
          {/* Date range selector for analytics */}
          <div className="w-full sm:w-auto flex justify-center">
            <Select 
              value={analyticsDateRange} 
              onValueChange={(value) => fetchAnalyticsData(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="analytics">
          {/* Key metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Unique Visitors */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getUniqueVisitors()}</div>
                <div className="flex items-center">
                  <Badge variant={getVisitorGrowthPct() >= 0 ? "default" : "destructive"} className="mr-1">
                    {getVisitorGrowthPct() >= 0 ? "+" : ""}{getVisitorGrowthPct()}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">vs previous period</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Page Views */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalPageViews()}</div>
                <div className="flex items-center">
                  <Badge variant={getPageViewGrowthPct() >= 0 ? "default" : "destructive"} className="mr-1">
                    {getPageViewGrowthPct() >= 0 ? "+" : ""}{getPageViewGrowthPct()}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">vs previous period</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Average Session Duration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageSessionDuration()}</div>
                <div className="flex items-center">
                  <Badge variant={getSessionDurationChange() >= 0 ? "default" : "destructive"} className="mr-1">
                    {getSessionDurationChange() >= 0 ? "+" : ""}{getSessionDurationChange()}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">vs previous period</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Bounce Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getBounceRate()}</div>
                <div className="flex items-center">
                  <Badge variant={getBounceRateChange() <= 0 ? "default" : "destructive"} className="mr-1">
                    {getBounceRateChange() <= 0 ? "" : "+"}{getBounceRateChange()}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">vs previous period</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Traffic Overview Chart */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Traffic Overview</CardTitle>
                  <Select defaultValue="visitors">
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue placeholder="Metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitors">Visitors</SelectItem>
                      <SelectItem value="pageViews">Page Views</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Daily metrics over selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyVisitorData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                      formatter={(value, name) => [value, name === "visitors" ? "Unique Visitors" : "Page Views"]}
                    />
                    <Legend />
                    <Bar dataKey="visitors" name="Unique Visitors" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="page_views" name="Page Views" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device & Traffic Source charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Visitors by device category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {deviceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} visitors`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How visitors find your site</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} visitors`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages & Visitor Growth charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topPagesData}
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                    <XAxis type="number" />
                    <Tooltip
                      formatter={(value) => [`${value} visits`, 'Visits']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="value" name="Visits" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Visitor Growth</CardTitle>
                <CardDescription>Weekly visitor trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyVisitorsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week_start" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} visitors`, 'Visitors']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Engagement & Time On Site charts */}
          {(visitorEngagementData.some(item => item.value > 0) || timeOnSiteData.some(item => item.value > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {visitorEngagementData.some(item => item.value > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                    <CardDescription>Pages viewed per session</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={visitorEngagementData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} sessions`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                        />
                        <Bar dataKey="value" name="Sessions" fill="#ff8042" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
              
              {timeOnSiteData.some(item => item.value > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Time On Site</CardTitle>
                    <CardDescription>Session duration distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeOnSiteData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} sessions`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                        />
                        <Bar dataKey="value" name="Sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Visitor Geography & Browser Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitorCountriesData.length > 0 && visitorCountriesData.some(item => item.value > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Geography</CardTitle>
                  <CardDescription>Top countries</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitorCountriesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {visitorCountriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} visitors`, 'Count']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            
            {browserUsageData.some(item => item.value > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Browser Usage</CardTitle>
                  <CardDescription>Visitors by browser</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {browserUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} visitors`, 'Count']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The database tab allows you to browse and manage your database tables. 
                  Select a table from the list below to view and edit its data.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tables list */}
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tables</CardTitle>
                <Database size={16} />
              </CardHeader>
              <CardContent>
                {tables.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {tables.map(table => (
                      <div 
                        key={table.name}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          currentTable === table.name 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleTableSelect(table.name)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{table.name}</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No tables found</p>
                    <p className="text-sm mt-2">Click the setup button above to initialize database functions</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Table details */}
            <Card className="md:col-span-3">
              {currentTable ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="capitalize">{currentTable}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={showSchema ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowSchema(true)}
                        >
                          <Database className="mr-1 h-4 w-4" />
                          Schema
                        </Button>
                        <Button 
                          variant={!showSchema ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowSchema(false)}
                        >
                          <Table2 className="mr-1 h-4 w-4" />
                          Data
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                
                  {/* Table Schema */}
                  {showSchema && (
                    <CardContent>
                      <div className="border rounded-md p-4 mb-4">
                        <h3 className="text-lg font-medium mb-3">Table Structure</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Constraints</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableColumns.map((column) => (
                              <TableRow key={column.column_name}>
                                <TableCell className="font-medium">{column.column_name}</TableCell>
                                <TableCell>{column.data_type}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1 flex-wrap">
                                    {column.is_nullable === 'YES' && (
                                      <Badge variant="default">Not Null</Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  )}
                
                  {/* Table Data */}
                  {!showSchema && (
                    <CardContent>
                      {tableData.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(tableData[0]).map(key => (
                                <TableHead key={key}>{key}</TableHead>
                              ))}
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.map((row, idx) => (
                              <TableRow key={row.id || idx}>
                                {Object.keys(row).map(key => (
                                  <TableCell key={key}>
                                    {typeof row[key] === 'object' 
                                      ? JSON.stringify(row[key]) 
                                      : String(row[key] || '-')}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
                                      <Edit size={16} />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id.toString())}>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p>No data in this table</p>
                      )}
                    </CardContent>
                  )}
                </>
              ) : (
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Database size={32} className="mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Select a table from the left to view its data</p>
                    <p className="text-sm text-gray-500 mt-2">You'll see schema details and data rows here</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat-history">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Conversation List */}
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <MessageSquare size={16} />
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex gap-2">
                    <Select value={chatFilter} onValueChange={setChatFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filterChatConversations().map(conv => (
                    <div 
                      key={conv.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        currentConversation === String(conv.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleConversationSelect(String(conv.id))}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium truncate">{conv.user_id || conv.session_id.substring(0, 8)}</span>
                        <Badge variant="outline" className="ml-1">
                          {conv.message_count}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{new Date(conv.created_at || '').toLocaleDateString()}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(String(conv.id));
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filterChatConversations().length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No conversations found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Conversation Messages */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>
                  {currentConversation 
                    ? `Conversation from ${new Date(
                        chatConversations.find(c => String(c.id) === currentConversation)?.created_at || ''
                      ).toLocaleString()}`
                    : 'Chat Messages'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentConversation ? (
                  conversationMessages.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {conversationMessages.map(message => (
                        <div 
                          key={message.id}
                          className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div 
                            className={`max-w-[80%] px-4 py-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.created_at || '').toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-12 text-muted-foreground">
                      No messages in this conversation
                    </p>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <MessageSquare size={32} className="mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Select a conversation to view messages</p>
                    <p className="text-sm text-gray-500 mt-2">You'll see the chat history here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {renderEditForm()}
    </div>
  );
} 