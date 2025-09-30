// Secure API client for portfolio data
// Replaces direct Supabase calls with secure server-side API

interface ApiError {
  error: string;
  details?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use relative URL in production, allow override for development
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api/data${endpoint}`);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all projects
  async getProjects() {
    return this.fetchData<any[]>('?table=projects');
  }

  // Get single project by ID
  async getProject(id: string | number) {
    return this.fetchData<any>(`?table=projects&id=${id}`);
  }

  // Get all experiences
  async getExperiences() {
    return this.fetchData<any[]>('?table=experiences');
  }

  // Get single experience by ID
  async getExperience(id: string | number) {
    return this.fetchData<any>(`?table=experiences&id=${id}`);
  }

  // Get about data
  async getAbout() {
    return this.fetchData<any[]>('?table=about');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper functions to mimic Supabase interface for easier migration
export const secureApi = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, options?: { ascending: boolean }) => ({
        // For projects and experiences, ordering is handled server-side
        execute: async () => {
          switch (table) {
            case 'projects':
              return { data: await apiClient.getProjects(), error: null };
            case 'experiences':
              return { data: await apiClient.getExperiences(), error: null };
            case 'about':
              return { data: await apiClient.getAbout(), error: null };
            default:
              throw new Error(`Table ${table} not supported`);
          }
        }
      }),
      eq: (column: string, value: any) => ({
        single: async () => {
          switch (table) {
            case 'projects':
              return { data: await apiClient.getProject(value), error: null };
            case 'experiences':
              return { data: await apiClient.getExperience(value), error: null };
            default:
              throw new Error(`Single record fetch for ${table} not supported`);
          }
        }
      }),
      // For direct select without additional chaining
      execute: async () => {
        switch (table) {
          case 'projects':
            return { data: await apiClient.getProjects(), error: null };
          case 'experiences':
            return { data: await apiClient.getExperiences(), error: null };
          case 'about':
            return { data: await apiClient.getAbout(), error: null };
          default:
            throw new Error(`Table ${table} not supported`);
        }
      }
    })
  })
};

// Error handler for backward compatibility
export const handleApiError = (error: any, operation: string = 'operation') => {
  console.error(`API ${operation} error:`, error);
  return { error: true, message: error.message || 'An unexpected error occurred' };
};