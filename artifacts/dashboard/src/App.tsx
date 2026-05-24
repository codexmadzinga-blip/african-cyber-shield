import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import LandingPage from "@/pages/landing";
import Home from "@/pages/home";
import Batch from "@/pages/batch";
import About from "@/pages/about";
import HistoryPage from "@/pages/history";
import PasswordPage from "@/pages/password";
import TwoFactorPage from "@/pages/two-factor";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import ContactPage from "@/pages/contact";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/analyzer">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/batch">
        <Layout><Batch /></Layout>
      </Route>
      <Route path="/history">
        <Layout><HistoryPage /></Layout>
      </Route>
      <Route path="/password">
        <Layout><PasswordPage /></Layout>
      </Route>
      <Route path="/2fa">
        <Layout><TwoFactorPage /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/contact">
        <Layout><ContactPage /></Layout>
      </Route>
      <Route path="/terms">
        <Layout><TermsPage /></Layout>
      </Route>
      <Route path="/privacy">
        <Layout><PrivacyPage /></Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
