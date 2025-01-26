"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
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
    <Card className="w-80">
      <CardHeader>
        <h2 className="text-xl font-semibold">Configuration</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div>
          <Input
            type="password"
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div>
          <Select
            label="Model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.displayName}
              </SelectItem>
            ))}
          </Select>
        </div>
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
        </div>
      </CardBody>
    </Card>
  );
} 