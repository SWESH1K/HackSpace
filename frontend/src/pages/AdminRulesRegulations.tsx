import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useState } from "react";
import { Event } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";

interface AdminRulesRegulationsProps {
  event: Event;
}

const AdminRulesRegulations = ({ event }: AdminRulesRegulationsProps) => {
  const [localEvent, setLocalEvent] = useState<Event>(event);
  const { toast } = useToast();

  const handleSave = async (content: object) => {
    setLocalEvent((prevEvent) => ({
      ...prevEvent,
      rules_and_regulations: content,
    }));

    try {
      const response = await fetch(`/api/event-details/${localEvent._id}/rules-regulations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules_and_regulations: content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save rules and regulations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Saved content:", data);

      // Show success toast
      toast({
        title: "Success",
        description: "Rules and regulations saved successfully.",
      });
    } catch (error) {
      console.error("Error saving rules and regulations:", error);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to save rules and regulations.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div>
        <SimpleEditor onSave={handleSave} defaultContent={event.rules_and_regulations} />
      </div>
    </>
  );
};

export default AdminRulesRegulations;