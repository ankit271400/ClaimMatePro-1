import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Upload from "@/pages/upload";
import Analysis from "@/pages/analysis";
import AnalysisOverview from "@/pages/analysis-overview";
import PolicyComparison from "@/pages/policy-comparison";
import ClaimPrep from "@/pages/claim-prep";
import ClaimTracker from "@/pages/claim-tracker";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/analysis" component={AnalysisOverview} />
      <Route path="/analysis/:id" component={Analysis} />
      <Route path="/compare/:id" component={PolicyComparison} />
      <Route path="/claim-prep/:id?" component={ClaimPrep} />
      <Route path="/claim-tracker/:id?" component={ClaimTracker} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
