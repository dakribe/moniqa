"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, PieChart, Calculator, Lightbulb } from "lucide-react";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("moniqa-welcome-seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("moniqa-welcome-seen", "true");
  };

  const promptExamples = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Spending Trends",
      prompt: "Show me my spending trends over the last 6 months",
    },
    {
      icon: <PieChart className="w-4 h-4" />,
      title: "Category Breakdown",
      prompt: "Create a pie chart of my expenses by category",
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Monthly Comparison",
      prompt: "Compare my income vs expenses by month",
    },
    {
      icon: <Calculator className="w-4 h-4" />,
      title: "Financial Summary",
      prompt: "What's my total savings and biggest expense category?",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Welcome to Moniqa
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Your AI-powered financial data analyst. Ask questions about your financial data 
            and get instant insights with interactive charts and visualizations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Quick Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ask for specific time periods: "last 3 months", "this year"</li>
              <li>• Request chart types: "show as bar chart", "create a pie chart"</li>
              <li>• Compare data: "compare X vs Y", "trends over time"</li>
              <li>• Get summaries: "total spending", "average monthly income"</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Try these example prompts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promptExamples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(example.prompt);
                    handleClose();
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-0.5">{example.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{example.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        "{example.prompt}"
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Click any example to copy it to your clipboard
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleClose} className="px-6">
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}