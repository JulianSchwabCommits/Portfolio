import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Database, MessageSquare, Search, ChevronRight, ChevronDown, Table2, BarChart3, PieChart, LineChart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import * as RechartsPrimitive from 'recharts';
import { motion } from 'framer-motion';

interface PageView {
  id: string;
  page_path: string;
  viewed_at: string;
  visitor_ip: string;
  referrer?: string;
  user_agent?: string;
}

interface UserInteraction {
  id: string;
  interaction_type: string;
  element_id: string;
  page_path: string;
  created_at: string;
  visitor_ip?: string;
  user_agent?: string;
}

interface Table {
  name: string;
  schema: string;
}

interface Column {
  name: string;
  type: string;
  is_nullable: boolean;
  is_primary_key: boolean;
}

interface ChatConversation {
  id: string;
  visitor_ip: string;
  user_agent: string;
  started_at: string;
  last_message_at: string;
  message_count?: number; 
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'bot';
  created_at: string;
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
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [showSqlDialog, setShowSqlDialog] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState<string>('week');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if we have a session storage item for admin auth
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth) {
      setIsAuthenticated(true);
      
      // Setup database functions before fetching data
      try {
        await setupDatabaseFunctions();
      } catch (e) {
        console.error('Error setting up database functions:', e);
      }
      
      fetchAnalyticsData('week'); // Default to week view
      fetchTables();
      fetchChatConversations();
    } else {
      navigate('/login');
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
        setPageViews(viewsResult.data as PageView[]);
      }
      if (interactionsResult.data) {
        setInteractions(interactionsResult.data as UserInteraction[]);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      // First attempt: try the RPC function if it exists
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_tables');
      
      if (!rpcError && rpcData) {
        // Format and sort tables
        const sortedTables = rpcData
          .map((t: any) => ({ 
            name: t.table_name || t.tablename, 
            schema: 'public' 
          }))
          .sort((a: Table, b: Table) => a.name.localeCompare(b.name));
        
        setTables(sortedTables);
        
        // Select first table if none selected
        if (sortedTables.length > 0 && !currentTable) {
          handleTableSelect(sortedTables[0].name);
        }
        return;
      }
      
      console.log('RPC method failed, trying fallback...');
      
      // Fallback: Try with known tables
      const knownTables = ['page_views', 'user_interactions', 'chat_conversations', 'chat_messages', 'admin_users'];
      
      const foundTables: Table[] = [];
      
      for (const tableName of knownTables) {
        try {
          // Test if we can access this table
          const { data } = await supabase.from(tableName).select('*').limit(1);
          if (data !== null) {
            foundTables.push({ name: tableName, schema: 'public' });
          }
        } catch (e) {
          console.log(`Table ${tableName} not accessible`);
        }
      }
      
      if (foundTables.length > 0) {
        setTables(foundTables);
        
        // Select first table if none selected
        if (!currentTable) {
          handleTableSelect(foundTables[0].name);
        }
      } else {
        console.error('No tables found or accessible');
      }
    } catch (err) {
      console.error('Error fetching database tables:', err);
    }
  };

  const fetchTableSchema = async (tableName: string) => {
    try {
      // First attempt: Try RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_table_columns', 
        { p_table_name: tableName }
      );
      
      if (!rpcError && rpcData) {
        setTableColumns(rpcData as Column[]);
        return;
      }
      
      console.log('RPC schema method failed, trying direct SQL...');
      
      // Second attempt: Try direct SQL
      await fetchTableSchemaDirect(tableName);
    } catch (err) {
      console.error(`Error getting schema for ${tableName}:`, err);
      // Last resort: infer from data
      await inferSchemaFromData(tableName);
    }
  };

  const handleTableSelect = async (tableName: string) => {
    if (tableName === currentTable) {
      // Toggle schema view if the same table is selected
      setShowSchema(!showSchema);
      return;
    }

    setCurrentTable(tableName);
    setShowSchema(true); // Always show schema first for a new table
    setTableColumns([]);
    setTableData([]);
    setLoading(true);
    
    try {
      // First attempt: Load schema using our cascading approach
      await fetchTableSchema(tableName);
      
      // Then fetch the data
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) {
        console.error(`Error fetching data for ${tableName}:`, error);
        // Try a direct SQL query as fallback
        const sqlResult = await executeSQL(`
          SELECT * FROM "${tableName}" LIMIT 100;
        `);
        
        if (sqlResult && !sqlResult.includes('Error')) {
          try {
            // Try to parse the SQL result
            const parsedData = JSON.parse(sqlResult);
            if (Array.isArray(parsedData)) {
              setTableData(parsedData);
            } else {
              setTableData([]);
            }
          } catch (parseErr) {
            console.error('Error parsing SQL result:', parseErr);
            setTableData([]);
          }
        } else {
          setTableData([]);
        }
      } else {
        setTableData(data || []);
      }
    } catch (err) {
      console.error(`Error loading table ${tableName}:`, err);
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
        setConversationMessages(data as ChatMessage[]);
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
    
    // Apply date filter
    if (chatFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(conv => new Date(conv.last_message_at) >= today);
    }
    else if (chatFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(conv => new Date(conv.last_message_at) >= weekAgo);
    }
    else if (chatFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(conv => new Date(conv.last_message_at) >= monthAgo);
    }
    
    // Apply search filter
    if (chatSearch) {
      const searchLower = chatSearch.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.visitor_ip.toLowerCase().includes(searchLower) ||
        conv.user_agent.toLowerCase().includes(searchLower)
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
      setError('');
      setChatConversations([]);
      setCurrentConversation('');
      setConversationMessages([]);
      setChatFilter('all');
      setChatSearch('');
      setShowSchema(false);
      setSqlQuery('');
      setSqlResult(null);
      setShowSqlDialog(false);
      setAnalyticsDateRange('week');
      
      // Force redirect
      window.location.href = '/admin';
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Function to directly execute SQL in Supabase for admin use
  const executeSQL = async (sql: string) => {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error('SQL execution error:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error executing SQL:', err);
      return null;
    }
  };
  
  // Function to execute raw SQL for creating required functions
  const setupDatabaseFunctions = async () => {
    try {
      // Create exec_sql function if it doesn't exist
      await executeSQL(`
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS text
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
          RETURN 'SQL executed successfully';
        EXCEPTION WHEN OTHERS THEN
          RETURN 'Error: ' || SQLERRM;
        END;
        $$;
      `);
      
      // Create get_tables function
      await executeSQL(`
        CREATE OR REPLACE FUNCTION get_tables()
        RETURNS TABLE (table_name text)
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN QUERY
          SELECT tablename::text
          FROM pg_catalog.pg_tables
          WHERE schemaname = 'public'
          ORDER BY tablename;
        END;
        $$;
      `);
      
      // Create get_table_columns function
      await executeSQL(`
        CREATE OR REPLACE FUNCTION get_table_columns(p_table_name text)
        RETURNS TABLE (
          name text,
          type text,
          is_nullable boolean,
          is_primary_key boolean
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN QUERY
          SELECT
            c.column_name::text AS name,
            c.data_type::text AS type,
            c.is_nullable = 'YES' AS is_nullable,
            CASE WHEN pk.constraint_name IS NOT NULL THEN true ELSE false END AS is_primary_key
          FROM
            information_schema.columns c
          LEFT JOIN (
            SELECT
              kcu.column_name,
              tc.constraint_name
            FROM
              information_schema.table_constraints tc
            JOIN
              information_schema.key_column_usage kcu
            ON
              tc.constraint_name = kcu.constraint_name AND
              tc.table_schema = kcu.table_schema
            WHERE
              tc.table_name = p_table_name AND
              tc.constraint_type = 'PRIMARY KEY' AND
              tc.table_schema = 'public'
          ) pk ON c.column_name = pk.column_name
          WHERE
            c.table_name = p_table_name AND
            c.table_schema = 'public'
          ORDER BY
            c.ordinal_position;
        END;
        $$;
      `);
      
      console.log('Database functions created successfully');
      return true;
    } catch (err) {
      console.error('Error setting up database functions:', err);
      return false;
    }
  };

  // Add button for manually setup database functions if needed
  const renderSetupButton = () => {
    return (
      <Button 
        onClick={async () => {
          setLoading(true);
          try {
            await setupDatabaseFunctions();
            toast({
              title: 'Success',
              description: 'Database functions created. Refreshing data...',
            });
            await fetchTables();
          } catch (err) {
            console.error('Setup error:', err);
            toast({
              title: 'Error',
              description: 'Failed to setup database functions',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        {loading ? 'Setting up...' : 'Setup Database Functions'}
      </Button>
    );
  };

  // Direct SQL approach to get table schema
  const fetchTableSchemaDirect = async (tableName: string) => {
    setLoading(true);
    try {
      // Execute raw SQL to get column information
      const sql = `
        SELECT 
          c.column_name as name,
          c.data_type as type,
          c.is_nullable = 'YES' as is_nullable,
          CASE 
            WHEN pk.constraint_name IS NOT NULL THEN true 
            ELSE false 
          END as is_primary_key
        FROM 
          information_schema.columns c
        LEFT JOIN (
          SELECT 
            kcu.column_name, 
            tc.constraint_name
          FROM 
            information_schema.table_constraints tc
          JOIN 
            information_schema.key_column_usage kcu
          ON 
            tc.constraint_name = kcu.constraint_name AND
            tc.table_schema = kcu.table_schema
          WHERE 
            tc.table_name = '${tableName}' AND
            tc.constraint_type = 'PRIMARY KEY' AND
            tc.table_schema = 'public'
        ) pk ON c.column_name = pk.column_name
        WHERE 
          c.table_name = '${tableName}' AND
          c.table_schema = 'public'
        ORDER BY 
          c.ordinal_position;
      `;
      
      const result = await executeSQL(sql);
      
      if (result && result.includes('Error')) {
        console.error('SQL error:', result);
        // Fall back to inferring from data
        await inferSchemaFromData(tableName);
      } else {
        // Try to parse the result as JSON if it contains valid data
        try {
          const parsedData = JSON.parse(result);
          if (Array.isArray(parsedData)) {
            setTableColumns(parsedData as Column[]);
          } else {
            await inferSchemaFromData(tableName);
          }
        } catch (parseErr) {
          console.log('Parsing SQL result failed, falling back');
          await inferSchemaFromData(tableName);
        }
      }
    } catch (err) {
      console.error('Error in direct schema query:', err);
      await inferSchemaFromData(tableName);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to infer schema from data
  const inferSchemaFromData = async (tableName: string) => {
    try {
      const { data: tableData } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (tableData && tableData.length > 0) {
        const inferredColumns = Object.keys(tableData[0]).map(key => ({
          name: key,
          type: typeof tableData[0][key],
          is_nullable: key !== 'id',
          is_primary_key: key === 'id'
        }));
        
        setTableColumns(inferredColumns as Column[]);
      } else {
        setTableColumns([]);
      }
    } catch (e) {
      console.error('Schema inference error:', e);
      setTableColumns([]);
    }
  };

  // Handle executing manual SQL queries
  const handleExecuteSQL = async () => {
    if (!sqlQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await executeSQL(sqlQuery);
      setSqlResult(result);
    } catch (err) {
      console.error('SQL execution error:', err);
      setSqlResult(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Render SQL query dialog
  const renderSqlDialog = () => {
    return (
      <Dialog open={showSqlDialog} onOpenChange={setShowSqlDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Execute SQL Query</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="sql-query" className="text-sm font-medium">
                SQL Query
              </label>
              <textarea
                id="sql-query"
                placeholder="Enter SQL query..."
                className="border rounded-md p-2 h-32 font-mono text-sm"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleExecuteSQL} 
                disabled={loading || !sqlQuery.trim()}
              >
                {loading ? 'Executing...' : 'Execute'}
              </Button>
            </div>
            
            {sqlResult !== null && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Result:</h3>
                <pre className="bg-muted rounded-md p-4 overflow-auto max-h-40 text-xs">
                  {typeof sqlResult === 'object' 
                    ? JSON.stringify(sqlResult, null, 2) 
                    : String(sqlResult)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Analytics helper functions
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
  
  const getViewsByDay = () => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7); // Last 7 days
    
    // Create an array of dates for the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();
    
    // Initialize the data with 0 views for each date
    const viewsByDay = dates.map(date => ({
      date: date.toISOString().split('T')[0],
      views: 0
    }));
    
    // Count views for each date
    pageViews.forEach(view => {
      const viewDate = new Date(view.viewed_at);
      viewDate.setHours(0, 0, 0, 0);
      
      const dateStr = viewDate.toISOString().split('T')[0];
      const dataPoint = viewsByDay.find(d => d.date === dateStr);
      
      if (dataPoint) {
        dataPoint.views++;
      }
    });
    
    return viewsByDay;
  };
  
  const getInteractionsByType = () => {
    const interactionGroups: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      const type = interaction.interaction_type || 'unknown';
      interactionGroups[type] = (interactionGroups[type] || 0) + 1;
    });
    
    return Object.entries(interactionGroups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const getDeviceTypes = () => {
    const deviceGroups: Record<string, number> = {
      'Mobile': 0,
      'Desktop': 0,
      'Tablet': 0,
      'Other': 0
    };
    
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
    
    pageViews.forEach(view => {
      const deviceType = detectDevice(view.user_agent);
      deviceGroups[deviceType] = (deviceGroups[deviceType] || 0) + 1;
    });
    
    return Object.entries(deviceGroups)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  };

  // Analytics helper to get activity by hour and day
  const getActivityHeatmap = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const heatmapData = [];
    
    // Initialize data structure with zeros
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmapData.push({
          day: days[day],
          hour: hour,
          value: 0,
          dayIndex: day // For sorting
        });
      }
    }
    
    // Populate with page views
    pageViews.forEach(view => {
      const date = new Date(view.viewed_at);
      const day = date.getDay(); // 0-6, 0 is Sunday
      const hour = date.getHours(); // 0-23
      
      const dataPoint = heatmapData.find(d => d.dayIndex === day && d.hour === hour);
      if (dataPoint) {
        dataPoint.value++;
      }
    });
    
    // Sort by day of week 
    return heatmapData.sort((a, b) => a.dayIndex - b.dayIndex || a.hour - b.hour);
  };

  const fetchAnalyticsData = async (range: string = 'week') => {
    setLoading(true);
    
    try {
      // Set date range based on selection
      let startDate = new Date();
      switch (range) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7); // Default to week
      }
      
      // Format date for query
      const formattedStartDate = startDate.toISOString();
      
      // Fetch page views with date filter
      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', formattedStartDate)
        .order('viewed_at', { ascending: false });
      
      if (viewsError) throw viewsError;
      
      // Fetch interactions with date filter
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('user_interactions')
        .select('*')
        .gte('created_at', formattedStartDate)
        .order('created_at', { ascending: false });
      
      if (interactionsError) throw interactionsError;
      
      // Update state with filtered data
      if (viewsData && Array.isArray(viewsData)) {
        const typedViewsData = viewsData.map(view => ({
          id: String(view.id || ''),
          page_path: String(view.page_path || ''),
          viewed_at: String(view.viewed_at || ''),
          visitor_ip: String(view.visitor_ip || ''),
          referrer: view.referrer ? String(view.referrer) : undefined,
          user_agent: view.user_agent ? String(view.user_agent) : undefined
        }));
        setPageViews(typedViewsData);
      }
      
      if (interactionsData && Array.isArray(interactionsData)) {
        const typedInteractionsData = interactionsData.map(interaction => ({
          id: String(interaction.id || ''),
          interaction_type: String(interaction.interaction_type || ''),
          element_id: String(interaction.element_id || ''),
          page_path: String(interaction.page_path || ''),
          created_at: String(interaction.created_at || ''),
          visitor_ip: interaction.visitor_ip ? String(interaction.visitor_ip) : undefined,
          user_agent: interaction.user_agent ? String(interaction.user_agent) : undefined
        }));
        setInteractions(typedInteractionsData);
      }
      
      setAnalyticsDateRange(range);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    // Redirect to login page
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="analytics">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="page-views">Page Views</TabsTrigger>
            <TabsTrigger value="interactions">User Interactions</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="chat-history">Chat History</TabsTrigger>
          </TabsList>
          
          <a 
            href="/admin" 
            onClick={(e) => {
              e.preventDefault();
              document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              sessionStorage.removeItem('admin_auth');
              localStorage.removeItem('admin_auth');
              window.location.href = '/admin';
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H3z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M13.707 8.707a1 1 0 0 0 0-1.414l-2-2a1 1 0 0 0-1.414 1.414L11.586 8H6a1 1 0 1 0 0 2h5.586l-1.293 1.293a1 1 0 0 0 1.414 1.414l2-2a1 1 0 0 0 0-1.414z" clipRule="evenodd" />
            </svg>
            Logout
          </a>
        </div>

        <TabsContent value="analytics">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-muted-foreground">Date Range:</label>
              <Select 
                value={analyticsDateRange} 
                onValueChange={(value) => fetchAnalyticsData(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              {loading && <span className="text-sm text-muted-foreground">Loading...</span>}
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            This dashboard provides insights into site traffic, user behavior, and engagement patterns. 
            Use the date range selector above to filter data by different time periods.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pageViews.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{interactions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Unique Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {new Set(pageViews.map(view => view.visitor_ip)).size}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Pages Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Pages</CardTitle>
                  <BarChart3 size={16} className="text-muted-foreground" />
                </div>
                <CardDescription>Most visited pages on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "#0ea5e9"
                    }
                  }}
                  className="aspect-[4/3]"
                >
                  <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
                    <RechartsPrimitive.BarChart data={getPageViewsByPage()}>
                      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                      <RechartsPrimitive.XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                      />
                      <RechartsPrimitive.YAxis width={40} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <RechartsPrimitive.Bar dataKey="value" name="views" fill="var(--color-views)" />
                    </RechartsPrimitive.BarChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Device Types Pie Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Device Types</CardTitle>
                  <PieChart size={16} className="text-muted-foreground" />
                </div>
                <CardDescription>Breakdown of device types used by visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Mobile: {
                      label: "Mobile",
                      color: "#0ea5e9"
                    },
                    Desktop: {
                      label: "Desktop",
                      color: "#84cc16"
                    },
                    Tablet: {
                      label: "Tablet",
                      color: "#8b5cf6"
                    },
                    Other: {
                      label: "Other",
                      color: "#d4d4d8"
                    }
                  }}
                  className="aspect-[4/3]"
                >
                  <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
                    <RechartsPrimitive.PieChart>
                      <RechartsPrimitive.Pie
                        data={getDeviceTypes()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={data => `${data.name}: ${data.value}`}
                        labelLine={false}
                      >
                        {getDeviceTypes().map((entry, index) => (
                          <RechartsPrimitive.Cell 
                            key={`cell-${index}`} 
                            fill={`var(--color-${entry.name})`} 
                          />
                        ))}
                      </RechartsPrimitive.Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </RechartsPrimitive.PieChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Daily Views Line Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Daily Page Views</CardTitle>
                  <LineChart size={16} className="text-muted-foreground" />
                </div>
                <CardDescription>Page view trends for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "#8b5cf6"
                    }
                  }}
                  className="aspect-[4/3]"
                >
                  <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
                    <RechartsPrimitive.LineChart data={getViewsByDay()}>
                      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                      <RechartsPrimitive.XAxis 
                        dataKey="date" 
                        tickFormatter={date => {
                          const [year, month, day] = date.split('-');
                          return `${month}/${day}`;
                        }} 
                      />
                      <RechartsPrimitive.YAxis width={40} />
                      <ChartTooltip 
                        content={({active, payload}) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Date:</div>
                                  <div>{data.date}</div>
                                  <div className="font-medium">Views:</div>
                                  <div>{data.views}</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }} 
                      />
                      <RechartsPrimitive.Line
                        type="monotone"
                        dataKey="views"
                        name="views"
                        stroke="var(--color-views)"
                        strokeWidth={2}
                        dot={true}
                      />
                    </RechartsPrimitive.LineChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Interaction Types Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interaction Types</CardTitle>
                  <BarChart3 size={16} className="text-muted-foreground" />
                </div>
                <CardDescription>Breakdown of different user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    interactions: {
                      label: "Interactions",
                      color: "#84cc16"
                    }
                  }}
                  className="aspect-[4/3]"
                >
                  <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
                    <RechartsPrimitive.BarChart 
                      data={getInteractionsByType()} 
                      layout="vertical"
                    >
                      <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                      <RechartsPrimitive.XAxis type="number" />
                      <RechartsPrimitive.YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                        tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsPrimitive.Bar dataKey="value" name="interactions" fill="var(--color-interactions)" />
                    </RechartsPrimitive.BarChart>
                  </RechartsPrimitive.ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Heatmap</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-blue-200"></span>
                    <span className="text-xs text-muted-foreground">Low</span>
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-muted-foreground">Medium</span>
                    <span className="h-3 w-3 rounded-full bg-blue-800"></span>
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                </div>
                <CardDescription>Visitor activity patterns by hour and day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[500px]">
                  <ChartContainer
                    config={{
                      activity: {
                        color: "#0ea5e9"
                      }
                    }}
                  >
                    <RechartsPrimitive.ResponsiveContainer width="100%" height={500}>
                      <RechartsPrimitive.ScatterChart
                        margin={{ top: 20, right: 30, bottom: 40, left: 80 }}
                      >
                        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                        <RechartsPrimitive.XAxis 
                          type="number" 
                          dataKey="hour" 
                          domain={[0, 23]} 
                          name="Hour" 
                          ticks={[0, 3, 6, 9, 12, 15, 18, 21, 23]}
                          tickSize={8}
                          label={{ value: 'Hour of Day', position: 'bottom', offset: 20 }}
                        />
                        <RechartsPrimitive.YAxis 
                          type="category" 
                          dataKey="day" 
                          name="Day" 
                          width={80}
                          tickSize={8}
                        />
                        <ChartTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({active, payload}) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid gap-1">
                                    <div className="font-medium">{data.day}, {data.hour}:00</div>
                                    <div>{data.value} visits</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <RechartsPrimitive.Scatter
                          data={getActivityHeatmap()}
                          fill="#8884d8"
                          shape={(props) => {
                            const { cx, cy, payload } = props;
                            const value = payload.value;
                            const size = Math.min(24, Math.max(6, value * 4 + 6));
                            
                            // Color based on activity level
                            let color = '#bfdbfe'; // Low (blue-200)
                            if (value > 5) color = '#3b82f6'; // Medium (blue-500)
                            if (value > 10) color = '#1e40af'; // High (blue-800)
                            
                            return (
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={size / 2} 
                                fill={color} 
                                fillOpacity={0.8}
                              />
                            );
                          }}
                        />
                      </RechartsPrimitive.ScatterChart>
                    </RechartsPrimitive.ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="page-views">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageViews.map((view) => (
                    <TableRow key={view.id}>
                      <TableCell>{view.page_path}</TableCell>
                      <TableCell>{view.visitor_ip}</TableCell>
                      <TableCell>{view.referrer || '-'}</TableCell>
                      <TableCell>{new Date(view.viewed_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(view)}>
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(view.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Element</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>{interaction.interaction_type}</TableCell>
                      <TableCell>{interaction.element_id}</TableCell>
                      <TableCell>{interaction.page_path}</TableCell>
                      <TableCell>{interaction.visitor_ip}</TableCell>
                      <TableCell>{new Date(interaction.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(interaction)}>
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(interaction.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Tools</CardTitle>
                <div className="flex gap-2">
                  {renderSetupButton()}
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSqlDialog(true)}
                  >
                    Run SQL Query
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The database tab allows you to browse and manage your database tables. 
                  If you don't see any tables, click the Setup Database Functions button above.
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
                              <TableRow key={column.name}>
                                <TableCell className="font-medium">{column.name}</TableCell>
                                <TableCell>{column.type}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1 flex-wrap">
                                    {column.is_primary_key && (
                                      <Badge variant="default">Primary Key</Badge>
                                    )}
                                    {!column.is_nullable && (
                                      <Badge variant="outline">Not Null</Badge>
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
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)}>
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
                        currentConversation === conv.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleConversationSelect(conv.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium truncate">{conv.visitor_ip}</span>
                        <Badge variant="outline" className="ml-1">
                          {conv.message_count}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{new Date(conv.started_at).toLocaleDateString()}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
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
                        chatConversations.find(c => c.id === currentConversation)?.started_at || ''
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
                              {new Date(message.created_at).toLocaleTimeString()}
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
      {renderSqlDialog()}
    </div>
  );
} 