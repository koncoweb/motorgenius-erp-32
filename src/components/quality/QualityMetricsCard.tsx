
import React from "react";
import { QualityCheck } from "@/services/qualityService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QualityMetricsCardProps {
  qualityChecks: QualityCheck[];
}

export const QualityMetricsCard: React.FC<QualityMetricsCardProps> = ({
  qualityChecks
}) => {
  // Calculate metrics
  const totalChecks = qualityChecks.length;
  const passedChecks = qualityChecks.filter(check => check.status === 'passed').length;
  const failedChecks = qualityChecks.filter(check => check.status === 'failed').length;
  const pendingChecks = qualityChecks.filter(check => check.status === 'pending').length;
  
  const passRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
  
  // Calculate average rating
  const checksWithRating = qualityChecks.filter(check => check.rating !== null);
  const avgRating = checksWithRating.length > 0 
    ? checksWithRating.reduce((sum, check) => sum + (check.rating || 0), 0) / checksWithRating.length 
    : 0;
  
  const formattedAvgRating = avgRating.toFixed(1);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          Quality Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pass Rate</span>
              <span className="font-medium">{passRate.toFixed(1)}%</span>
            </div>
            <Progress value={passRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col items-center p-2 bg-green-50 rounded-md border border-green-100">
              <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-xl font-bold">{passedChecks}</span>
              <span className="text-xs text-muted-foreground">Passed</span>
            </div>
            
            <div className="flex flex-col items-center p-2 bg-red-50 rounded-md border border-red-100">
              <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-xl font-bold">{failedChecks}</span>
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            
            <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md border border-yellow-100">
              <Clock className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-xl font-bold">{pendingChecks}</span>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Rating</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-amber-500 mr-1">{formattedAvgRating}</span>
                <span className="text-sm text-amber-500">★</span>
              </div>
            </div>
            <Progress value={avgRating * 20} className="h-2 mt-2" /> {/* Scale to percentage (5 stars = 100%) */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
