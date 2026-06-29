import React from "react";
import "./App.css";
import Navigation from "./navigation";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <div className="App">
      <Navigation />
      <Toaster richColors position="top-right" />
    </div>
  );
}
