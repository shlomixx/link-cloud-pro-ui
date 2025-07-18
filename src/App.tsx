import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";

const queryClient = new QueryClient();

// App Layout with bottom navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="font-sans bg-background text-foreground min-h-screen">
    <main className="pb-24 min-h-screen">
      {children}
    </main>
    <BottomNav />
  </div>
);

// Placeholder page component
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-3xl font-heading font-semibold mb-4 text-foreground">{title}</h1>
      <p className="text-terra-gray">This page is coming soon!</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/learn" element={<AppLayout><PlaceholderPage title="Learn" /></AppLayout>} />
          <Route path="/challenges" element={<AppLayout><PlaceholderPage title="Challenges" /></AppLayout>} />
          <Route path="/community" element={<AppLayout><PlaceholderPage title="Community" /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><PlaceholderPage title="Profile" /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
