"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Divider } from "@heroui/react";
import { Model } from "@/types/gemini";
import { listModels } from "@/services/implementations/GeminiQuestionnaireService";

interface ConfigSidebarProps {
  onConfigChange: (config: {
    apiKey: string;
    model: string;
    temperature: number;
  }) => void;
}

export default function ConfigSidebar({ onConfigChange }: ConfigSidebarProps) {
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem("gemini-config");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setApiKey(config.apiKey);
      setSelectedModel(config.model);
      setTemperature(config.temperature);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      listModels(apiKey)
        .then((fetchedModels) => setModels(fetchedModels as Model[]))
        .catch(console.error);
    }
  }, [apiKey]);

  useEffect(() => {
    const config = {
      apiKey,
      model: selectedModel,
      temperature,
    };
    localStorage.setItem("gemini-config", JSON.stringify(config));
    onConfigChange(config);
  }, [apiKey, selectedModel, temperature, onConfigChange]);

  return (
    <Card className="w-80 h-fit sticky top-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Configuration</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div>
          <Input
            type="password"
            label="API Key"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
        </div>
        <Divider />
        <div>
          <Select
            label="Model"
            placeholder="Select a model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.length > 0 ? (
              models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.displayName}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem key="gemini-1.0-pro" value="gemini-1.0-pro">
                  Gemini 1.0 Pro
                </SelectItem>
                <SelectItem key="gemini-1.5-pro" value="gemini-1.5-pro">
                  Gemini 1.5 Pro
                </SelectItem>
              </>
            )}
          </Select>
        </div>
        <Divider />
        <div>
          <label className="block text-sm font-medium mb-2">
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Precise (0)</span>
            <span>Balanced (0.5)</span>
            <span>Creative (1)</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 