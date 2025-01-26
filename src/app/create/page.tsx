"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import CreateQuestionnaireForm from "@/components/create-questionnaire-form";

export default function CreateQuestionnairePage() {
  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-[#1a1a1a] shadow-md">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Create New Questionnaire
          </h1>
        </CardHeader>
        <CardBody className="p-6">
          <CreateQuestionnaireForm />
        </CardBody>
      </Card>
    </div>
  );
} 