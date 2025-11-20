"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserCircle2, Baby, Lock } from "lucide-react";

// --- UPDATED IMPORTS (Using the new unique filenames) ---
import ChildDashboard from "@/components/ChildDashboardMain"; 
import ParentDashboard from "@/components/ParentDashboardMain"; 

export default function VidyaSetuDashboard() {
  const [view, setView] = useState<"landing" | "child" | "parent">("landing");
  
  // Password State
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleParentClick = () => {
    setIsPasswordOpen(true);
    setPassword("");
    setError("");
  };

  const handlePasswordSubmit = () => {
    if (password === "1234") { // Dummy Password
      setIsPasswordOpen(false);
      setView("parent");
    } else {
      setError("Incorrect password.");
    }
  };

  if (view === "child") {
    return (
      <div>
        <button 
          onClick={() => setView("landing")} 
          className="fixed top-2 left-2 z-[100] opacity-0 hover:opacity-100 bg-white p-2 rounded-full text-xs border transition-opacity"
        >
          Exit
        </button>
        <ChildDashboard />
      </div>
    );
  }

  if (view === "parent") {
    return (
      <div>
        <button 
          onClick={() => setView("landing")} 
          className="fixed bottom-4 right-4 z-50 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        >
          Log Out
        </button>
        <ParentDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-3xl animate-in fade-in zoom-in duration-500">
        
        <div className="space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
            VidyaSetu
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            Bridging learning gaps with fun & insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Child Card */}
          <div 
            onClick={() => setView("child")}
            className="group relative bg-white p-8 rounded-3xl shadow-xl border-4 border-transparent hover:border-yellow-400 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Baby size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-2">I'm a Student</h2>
            <p className="text-gray-500 text-lg">Play games, read stories, and learn!</p>
            <Button className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl h-14 rounded-xl">
              Start Adventure 🚀
            </Button>
          </div>

          {/* Parent Card */}
          <div 
            onClick={handleParentClick}
            className="group relative bg-white p-8 rounded-3xl shadow-xl border-4 border-transparent hover:border-blue-600 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <UserCircle2 size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-2">I'm a Parent</h2>
            <p className="text-gray-500 text-lg">View progress, insights, and settings.</p>
            <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl h-14 rounded-xl">
              View Dashboard 📊
            </Button>
          </div>
        </div>

        {/* Password Dialog */}
        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> Parent Access
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
              <Button onClick={handlePasswordSubmit} className="bg-blue-600 hover:bg-blue-700">Access Dashboard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}