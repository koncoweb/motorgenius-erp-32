
import { supabase } from '@/integrations/supabase/client';

export interface QualityCheck {
  id: string;
  inspectionDate: string;
  workOrderId: number | null;
  workOrderNumber?: string;
  inspector: string;
  status: 'passed' | 'failed' | 'pending';
  rating: number | null;
  notes: string | null;
  actionItems: string | null;
  createdAt: string;
}

export interface QualityStandard {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export interface QualityCheckResult {
  id: string;
  qualityCheckId: string;
  standardId: string;
  standardName?: string;
  standardCategory?: string;
  passed: boolean;
  comments: string | null;
}

// Helper function to convert from Supabase format to our app format
const mapQualityCheck = (item: any): QualityCheck => ({
  id: item.id,
  inspectionDate: item.inspection_date,
  workOrderId: item.work_order_id,
  workOrderNumber: item.work_order_number,
  inspector: item.inspector,
  status: item.status,
  rating: item.rating,
  notes: item.notes,
  actionItems: item.action_items,
  createdAt: item.created_at
});

const mapQualityStandard = (item: any): QualityStandard => ({
  id: item.id,
  name: item.name,
  description: item.description,
  category: item.category
});

const mapQualityCheckResult = (item: any): QualityCheckResult => ({
  id: item.id,
  qualityCheckId: item.quality_check_id,
  standardId: item.standard_id,
  standardName: item.standard_name,
  standardCategory: item.standard_category,
  passed: item.passed,
  comments: item.comments
});

export async function fetchQualityChecks(): Promise<QualityCheck[]> {
  try {
    const { data, error } = await supabase
      .from('quality_checks')
      .select(`
        *,
        project:work_order_id (work_order_number)
      `)
      .order('inspection_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching quality checks:', error);
      throw error;
    }
    
    return (data || []).map((item) => ({
      ...mapQualityCheck(item),
      workOrderNumber: item.project?.work_order_number || null
    }));
  } catch (error) {
    console.error('Failed to fetch quality checks:', error);
    return [];
  }
}

export async function fetchQualityStandards(): Promise<QualityStandard[]> {
  try {
    const { data, error } = await supabase
      .from('quality_standards')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching quality standards:', error);
      throw error;
    }
    
    return (data || []).map(mapQualityStandard);
  } catch (error) {
    console.error('Failed to fetch quality standards:', error);
    return [];
  }
}

export async function fetchQualityCheckResults(qualityCheckId: string): Promise<QualityCheckResult[]> {
  try {
    const { data, error } = await supabase
      .from('quality_check_results')
      .select(`
        *,
        quality_standards:standard_id (name, category)
      `)
      .eq('quality_check_id', qualityCheckId);
    
    if (error) {
      console.error('Error fetching quality check results:', error);
      throw error;
    }
    
    return (data || []).map((item) => ({
      ...mapQualityCheckResult(item),
      standardName: item.quality_standards?.name,
      standardCategory: item.quality_standards?.category
    }));
  } catch (error) {
    console.error('Failed to fetch quality check results:', error);
    return [];
  }
}

export async function addQualityCheck(
  qualityCheck: Omit<QualityCheck, 'id' | 'createdAt'>,
  checkResults: Omit<QualityCheckResult, 'id' | 'qualityCheckId'>[]
): Promise<QualityCheck | null> {
  try {
    // Convert from camelCase (frontend) to snake_case (database)
    const dbQualityCheck = {
      inspection_date: qualityCheck.inspectionDate,
      work_order_id: qualityCheck.workOrderId,
      inspector: qualityCheck.inspector,
      status: qualityCheck.status,
      rating: qualityCheck.rating,
      notes: qualityCheck.notes,
      action_items: qualityCheck.actionItems
    };

    console.log('Adding quality check with data:', dbQualityCheck);

    // Insert the quality check
    const { data: checkData, error: checkError } = await supabase
      .from('quality_checks')
      .insert(dbQualityCheck)
      .select('*')
      .single();
    
    if (checkError) {
      console.error('Error adding quality check:', checkError);
      throw checkError;
    }
    
    console.log('Successfully added quality check:', checkData);
    
    // If we have check results, insert them
    if (checkResults.length > 0) {
      const dbCheckResults = checkResults.map(result => ({
        quality_check_id: checkData.id,
        standard_id: result.standardId,
        passed: result.passed,
        comments: result.comments
      }));
      
      const { error: resultsError } = await supabase
        .from('quality_check_results')
        .insert(dbCheckResults);
      
      if (resultsError) {
        console.error('Error adding quality check results:', resultsError);
        // We'll still return the quality check even if results failed
      }
    }
    
    return mapQualityCheck(checkData);
  } catch (error) {
    console.error('Failed to add quality check:', error);
    return null;
  }
}

export async function updateQualityCheckStatus(id: string, status: QualityCheck['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quality_checks')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating quality check status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update quality check status:', error);
    return false;
  }
}

export async function deleteQualityCheck(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quality_checks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting quality check:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete quality check:', error);
    return false;
  }
}
