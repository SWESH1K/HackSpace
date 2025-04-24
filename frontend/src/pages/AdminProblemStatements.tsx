import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useState } from "react";
import { Event } from "@/hooks/useEvents";

interface AdminProblemStatementsProps {
  event: Event;
}

const AdminProblemStatements = ({ event }: AdminProblemStatementsProps) => {
  const [localEvent, setLocalEvent] = useState<Event>(event);

  const handleSave = async (content: object) => {
    setLocalEvent((prevEvent) => ({
      ...prevEvent,
      problem_statements: content,
    }));

    try {
      const response = await fetch(`/api/event-details/${localEvent._id}/problem-statement`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem_statements: content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save problem statements: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Saved content:", data);
    } catch (error) {
      console.error("Error saving problem statements:", error);
    }
  };

  return (
    <>
      <div>
        <SimpleEditor onSave={handleSave} defaultContent={event.problem_statements} />
      </div>
    </>
  );
};

export default AdminProblemStatements;