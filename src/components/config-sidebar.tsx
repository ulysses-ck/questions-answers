"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Divider, Accordion, AccordionItem, Slider } from "@heroui/react";
import { Model } from "@/types/gemini";
import { listModels } from "@/services/implementations/GeminiQuestionnaireService";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface SafetySetting {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [safetySettings, setSafetySettings] = useState<SafetySetting[]>([
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ]);

  const blockThresholds = [
    { value: HarmBlockThreshold.BLOCK_NONE, label: "Block none", sliderValue: 0 },
    { value: HarmBlockThreshold.BLOCK_ONLY_HIGH, label: "Block high", sliderValue: 1 },
    { value: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, label: "Block medium & high", sliderValue: 2 },
    { value: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE, label: "Block low & above", sliderValue: 3 },
  ];

  const getThresholdFromSliderValue = (value: number) => {
    return blockThresholds.find(t => t.sliderValue === value)?.value || HarmBlockThreshold.BLOCK_NONE;
  };

  const getSliderValueFromThreshold = (threshold: HarmBlockThreshold) => {
    return blockThresholds.find(t => t.value === threshold)?.sliderValue || 0;
  };

  const harmCategories = {
    [HarmCategory.HARM_CATEGORY_HARASSMENT]: "Harassment content",
    [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: "Hate speech and content that incites violence",
    [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: "Sexually explicit content",
    [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: "Dangerous content",
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
    const fetchModels = async () => {
      if (!apiKey) {
        setModels([]);
        setApiError(null);
        return;
      }

      try {
        const fetchedModels = await listModels(apiKey);
        if (Array.isArray(fetchedModels) && fetchedModels.length > 0) {
          setModels(fetchedModels);
          setApiError(null);
        } else {
          setModels([]);
          setApiError('No models available. Please check your API key.');
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels([]);
        if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError('Failed to fetch models. Please check your connection and try again.');
        }
      }
    };

    fetchModels();
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

  const handleSafetySettingChange = (category: HarmCategory, sliderValue: number) => {
    setSafetySettings((prev) =>
      prev.map((setting) =>
        setting.category === category
          ? { ...setting, threshold: getThresholdFromSliderValue(sliderValue) }
          : setting
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
            isInvalid={!!apiError}
            errorMessage={apiError}
          />
          {apiError && (
            <div className="mt-2 p-3 bg-danger-50 dark:bg-danger-900/30 text-danger rounded-lg">
              <p className="text-sm">
                <strong>Configuration Error:</strong> {apiError}
              </p>
              <p className="text-xs mt-1">
                To get a valid API key:
                <ol className="list-decimal ml-4 mt-1">
                  <li>Visit the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>Create or select a project</li>
                  <li>Generate an API key</li>
                  <li>Copy and paste it here</li>
                </ol>
              </p>
            </div>
          )}
        </div>
        <Divider />
        <div>
          <Select
            label="Model"
            placeholder={apiError ? "Please fix API key first" : "Select a model"}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            isDisabled={!!apiError}
            className={apiError ? "opacity-50" : ""}
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
          <Slider 
            aria-label="Temperature"
            step={0.1}
            maxValue={1}
            minValue={0}
            value={temperature}
            onChange={(value) => setTemperature(Number(value))}
            className="max-w-md"
            marks={[
              { value: 0, label: "Precise" },
              { value: 0.5, label: "Balanced" },
              { value: 1, label: "Creative" }
            ]}
          />
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
                Adjusting these settings may affect the model&apos;s filtering of potentially harmful content.
                Please use responsibly.
              </p>
            </div>
            <h4 className="text-sm font-medium mb-4">Safety Settings</h4>
            {safetySettings.map((setting) => (
              <div key={setting.category} className="mb-6">
                <label className="block text-sm mb-2">
                  {harmCategories[setting.category as keyof typeof harmCategories]}
                </label>
                <Slider
                  aria-label={harmCategories[setting.category as keyof typeof harmCategories]}
                  step={1}
                  maxValue={3}
                  minValue={0}
                  value={getSliderValueFromThreshold(setting.threshold)}
                  onChange={(value) => handleSafetySettingChange(setting.category, Number(value))}
                  className="max-w-md"
                  marks={[
                    { value: 0, label: "None" },
                    { value: 1, label: "High" },
                    { value: 2, label: "Medium+" },
                    { value: 3, label: "Low+" }
                  ]}
                />
              </div>
            ))}
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
} 