import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProtectedRoute } from "@/lib/ProtectedRoute";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const GifConverter = lazy(() => import("@/pages/GifConverter"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <ProtectedRoute path="/feedback" component={Feedback} />
        <ProtectedRoute path="/converter" component={GifConverter} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="gifgetter-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;