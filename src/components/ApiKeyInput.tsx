
import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Key, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ApiKeyInput() {
  const { state, setApiKey } = useChat();
  const [inputKey, setInputKey] = useState(state.apiKey || "");
  const [open, setOpen] = useState(false);

  const handleSaveKey = () => {
    setApiKey(inputKey.trim());
    setOpen(false);
  };

  const handleClearKey = () => {
    setApiKey("");
    setInputKey("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 ${state.apiKey ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
        >
          {state.apiKey ? <Lock className="h-4 w-4" /> : <Key className="h-4 w-4" />}
          {state.apiKey ? "API Key Set" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable Joe to respond with actual AI-powered responses.
            Your key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="col-span-3"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Your API key is stored only in your browser's local storage and is not sent to our servers.
            Without an API key, Joe will respond with simulated responses for demonstration purposes.
          </p>
        </div>
        <DialogFooter className="flex sm:justify-between">
          {state.apiKey && (
            <Button variant="destructive" onClick={handleClearKey}>
              Clear API Key
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKey} disabled={!inputKey.trim()}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
