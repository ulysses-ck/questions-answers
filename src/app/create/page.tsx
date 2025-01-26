"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import ConfigSidebar from "@/components/config-sidebar";
import QuestionnaireForm from "@/components/questionnaire-form";

export default function CreateQuestionnairePage() {
  const [config, setConfig] = useState({
    apiKey: "",
    model: "",
    temperature: 0.7,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        <ConfigSidebar onConfigChange={setConfig} />
        <div className="flex-1">
          <Card>
            <CardBody>
              <h1 className="text-2xl font-bold mb-4">Create New Questionnaire</h1>
              {config.apiKey && config.model ? (
                <QuestionnaireForm config={config} />
              ) : (
                <p className="text-gray-500">
                  Please configure your API key and model in the sidebar to start generating questions.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
} 