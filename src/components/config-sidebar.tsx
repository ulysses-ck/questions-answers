"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Divider, Accordion, AccordionItem } from "@heroui/react";
import { Model } from "@/types/gemini";
import { listModels } from "@/services/implementations/GeminiQuestionnaireService";

interface SafetySetting {
  category: string;
  threshold: string;
}

interface ConfigSidebarProps {
  onConfigChange: (config: {
    apiKey: string;
    model: string;
    temperature: number;
    safetySettings: SafetySetting[];
  }) => void;
}

export default function ConfigSidebar({ onConfigChange }: ConfigSidebarProps) {
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [safetySettings, setSafetySettings] = useState<SafetySetting[]>([
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]);

  const blockThresholds = [
    { value: "BLOCK_NONE", label: "Block none" },
    { value: "BLOCK_ONLY_HIGH", label: "Block high" },
    { value: "BLOCK_MEDIUM_AND_ABOVE", label: "Block medium & high" },
    { value: "BLOCK_LOW_AND_ABOVE", label: "Block low & above" },
  ];

  const harmCategories = {
    HARM_CATEGORY_HARASSMENT: "Harassment content",
    HARM_CATEGORY_HATE_SPEECH: "Hate speech and content that incites violence",
    HARM_CATEGORY_SEXUALLY_EXPLICIT: "Sexually explicit content",
    HARM_CATEGORY_DANGEROUS_CONTENT: "Dangerous content",
  };

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem("gemini-config");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setApiKey(config.apiKey);
      setSelectedModel(config.model);
      setTemperature(config.temperature);
      if (config.safetySettings) {
        setSafetySettings(config.safetySettings);
      }
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
      safetySettings,
    };
    localStorage.setItem("gemini-config", JSON.stringify(config));
    onConfigChange(config);
  }, [apiKey, selectedModel, temperature, safetySettings, onConfigChange]);

  const handleSafetySettingChange = (category: string, threshold: string) => {
    setSafetySettings((prev) =>
      prev.map((setting) =>
        setting.category === category ? { ...setting, threshold } : setting
      )
    );
  };

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
        <Divider />
        <Accordion>
          <AccordionItem
            key="advanced-config"
            aria-label="Advanced Configuration"
            title="Advanced Configuration"
          >
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                You are responsible for ensuring that safety settings comply with your intended use case.
                Adjusting these settings may affect the model's filtering of potentially harmful content.
                Please use responsibly.
              </p>
            </div>
            <h4 className="text-sm font-medium mb-4">Safety Settings</h4>
            {safetySettings.map((setting) => (
              <div key={setting.category} className="mb-4">
                <label className="block text-sm mb-2">
                  {harmCategories[setting.category as keyof typeof harmCategories]}
                </label>
                <Select
                  value={setting.threshold}
                  onChange={(e) =>
                    handleSafetySettingChange(setting.category, e.target.value)
                  }
                  className="w-full"
                >
                  {blockThresholds.map((threshold) => (
                    <SelectItem key={threshold.value} value={threshold.value}>
                      {threshold.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            ))}
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
} 