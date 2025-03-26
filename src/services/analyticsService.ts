
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  metric_category: string;
  source_page: string;
  created_at: string;
}

export async function fetchAnalyticsMetrics(): Promise<AnalyticsMetric[]> {
  try {
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching analytics metrics:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch analytics metrics:', error);
    return [];
  }
}

export async function fetchMetricsByCategory(category: string): Promise<AnalyticsMetric[]> {
  try {
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('*')
      .eq('metric_category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching ${category} metrics:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch ${category} metrics:`, error);
    return [];
  }
}

export async function addAnalyticsMetric(metric: Omit<AnalyticsMetric, 'id' | 'created_at'>): Promise<AnalyticsMetric | null> {
  try {
    const { data, error } = await supabase
      .from('analytics_metrics')
      .insert(metric)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding analytics metric:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to add analytics metric:', error);
    return null;
  }
}
