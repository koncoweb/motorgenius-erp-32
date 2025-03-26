
import React from "react";
import { FinancialSummary } from "@/services/financeService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface FinancialSummaryCardsProps {
  summary: FinancialSummary | null;
  isLoading?: boolean;
}

export function FinancialSummaryCards({ summary, isLoading = false }: FinancialSummaryCardsProps) {
  const formatMonthYear = (dateString: string) => {
    if (!dateString) return "Current Month";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl text-green-600">Rp0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No data available</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-600">Rp0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No data available</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Income</CardDescription>
            <CardTitle className="text-2xl">Rp0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No data available</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const period = formatMonthYear(summary.month);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{period} Revenue</CardDescription>
          <CardTitle className="text-2xl text-green-600">
            {formatRupiah(summary.total_revenue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Total revenue for {period}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{period} Expenses</CardDescription>
          <CardTitle className="text-2xl text-red-600">
            {formatRupiah(summary.total_expenses)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
            <span className="text-sm text-muted-foreground">Total expenses for {period}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{period} Net Income</CardDescription>
          <CardTitle className={`text-2xl ${summary.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatRupiah(summary.net_income)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            {summary.net_income >= 0 ? (
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
            )}
            <span className="text-sm text-muted-foreground">
              Net income for {period}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
