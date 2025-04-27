import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Key, Lock } from 'lucide-react';

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('api_key');
    if (savedKey) {
      setHasKey(true);
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('api_key', apiKey);
    setHasKey(true);
    setIsEditing(false);
  };

  return isEditing ? (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="h-10 bg-white border-black"
      />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="h-10 w-10 hover:bg-black hover:text-white bg-white text-black border-black"
      >
        <Key className="h-5 w-5" />
        <span className="sr-only">Save API Key</span>
      </Button>
    </form>
  ) : (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsEditing(true)}
      className={`h-10 w-10 hover:bg-black hover:text-white bg-white text-black border-black ${
        hasKey ? 'bg-green-50' : ''
      }`}
      title={hasKey ? "Update API Key" : "Set API Key"}
    >
      {hasKey ? <Lock className="h-5 w-5" /> : <Key className="h-5 w-5" />}
      <span className="sr-only">{hasKey ? "Update API Key" : "Set API Key"}</span>
    </Button>
  );
}
