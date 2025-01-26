import { Card, CardBody, CardHeader, CardFooter, Divider } from "@heroui/react";
import { getQuestionnaires } from "@/server/queries/questionnaire.query";
import Link from "next/link";
import { Button } from "@heroui/button";
import DeleteQuestionnaireButton from "@/components/delete-questionnaire-button";

export default async function ListQuestionnairePage() {
    const questionnaires = await getQuestionnaires();

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    Questionnaires
                </h1>
                <Link href="/create">
                    <Button 
                        color="primary"
                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                        startContent={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        Create New
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {questionnaires.map((questionnaire) => (
                    <Card key={questionnaire.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-[#1a1a1a]">
                        <CardHeader className="flex gap-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col flex-grow">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Question #{questionnaire.id}</p>
                                <h2 className="text-lg font-semibold text-black dark:text-white">{questionnaire.question}</h2>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Link href={`/${questionnaire.id}/edit`} className="w-full sm:w-auto">
                                    <Button 
                                        color="default" 
                                        variant="flat"
                                        size="sm"
                                        className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                        startContent={
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                            </svg>
                                        }
                                    >
                                        Edit
                                    </Button>
                                </Link>
                                <DeleteQuestionnaireButton id={questionnaire.id} />
                            </div>
                            <Link href={`/${questionnaire.id}`} className="w-full sm:w-auto">
                                <Button 
                                    color="primary"
                                    variant="solid"
                                    size="sm"
                                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                                    startContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                >
                                    Play
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}

                {questionnaires.length === 0 && (
                    <div className="col-span-full">
                        <Card className="bg-white dark:bg-[#1a1a1a]">
                            <CardBody>
                                <p className="text-center text-gray-500 dark:text-gray-400">No questionnaires found</p>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
