"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { deleteQuestionnaire } from "@/server/actions/questionnaire.mutation";
import { useState } from "react";

type DeleteQuestionnaireButtonProps = {
  id: number;
};

export default function DeleteQuestionnaireButton({ id }: DeleteQuestionnaireButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteQuestionnaire(id);
      
      if (result.success) {
        onClose();
      } else {
        console.error("Failed to delete questionnaire");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        color="danger"
        variant="flat"
        onPress={onOpen}
      >
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this questionnaire? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 