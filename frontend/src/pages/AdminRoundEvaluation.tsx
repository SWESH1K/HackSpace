import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
  } from "../components/ui/animated-modal";
import { Event, Round } from "@/hooks/useEvents";
import { DateTimePickerWithRange } from "@/components/DateTimePickerWithRange";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface AdminRoundEvaluationProps {
  event: Event;
}

const AdminRoundEvaluation = ({ event}: AdminRoundEvaluationProps) => {
    const [rounds, setRounds] = useState<Round[]>([]);
    const {toast} = useToast();

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await axios.get(`/api/event/${event._id}/rounds`);
        setRounds(response.data.data);
      } catch (error) {
        console.error("Failed to fetch rounds:", error);
      }
    };

    fetchRounds();
  }, [event._id]);
  const [newRound, setNewRound] = useState<Partial<Round>>({
    name: "",
    time: new Date(),
    evaluation_pattern: { pattern: [] },
  });
  const [newPattern, setNewPattern] = useState<{ name: string; max_marks: number }>({
    name: "",
    max_marks: 0,
  });

  const handleAddPattern = () => {
    if (newRound.evaluation_pattern) {
      newRound.evaluation_pattern.pattern.push(newPattern);
      setNewPattern({ name: "", max_marks: 0 });
    }
  };

  const handleAddRound = async () => {
    if (newRound.name && newRound.time && newRound.evaluation_pattern) {
      const maxMarks = newRound.evaluation_pattern.pattern.reduce(
        (sum, item) => sum + item.max_marks,
        0
      );
  
      const payload = {
        name: newRound.name,
        time: newRound.time.toISOString(), // Ensure time is in ISO format
        evaluation_pattern: {
          pattern: newRound.evaluation_pattern.pattern,
        },
        max_marks: maxMarks,
      };
  
      console.log("Payload:", payload);
  
      try {
        const response = await fetch(`/api/event/${event._id}/rounds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to add round: ${response.statusText}`);
        }
  
        const data = await response.json();
        setRounds([...rounds, data.data]);
        setNewRound({ name: "", time: new Date(), evaluation_pattern: { pattern: [] } });
  
        // Show success toast
        toast({
          title: "Success",
          description: `Round "${newRound.name}" added successfully.`,
        });
      } catch (error) {
        console.error("Failed to add round:", error);

        // Narrow the type of 'error'
        const errorMessage =
        error instanceof Error
            ? error.message
            : "An unknown error occurred.";
  
        // Show error toast
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      // Show validation error toast
      toast({
        title: "Error",
        description: "Please fill in all required fields before adding a round.",
      });
    }
  };


  const handleDateTimeChange = (date: Date | undefined, startTime: string) => {
    if (date) {
      setNewRound((prev) => ({
        ...prev,
        time: new Date(`${date.toDateString()} ${startTime}`),
      }));
    }
  };

  const handleDeleteRound = async (roundName: string) => {
    try {
      const response = await fetch(`/api/event/${event._id}/rounds`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roundName }),
      });

      if (response.ok) {
        const updatedRounds = rounds.filter((round) => round.name !== roundName);
         // Remove the deleted round from the current rounds
        setRounds(updatedRounds);
        toast({
          title: "Success",
          description: `Round "${roundName}" deleted successfully.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete round.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete round: ${error}`,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Current Evaluation Plan</h2>
      {rounds.map((round, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{round.name}</h3>
              <h3>{round.max_marks} Marks</h3>
            </div>
            <div className="text-sm text-gray-500">
                {round.time ? format(new Date(round.time), "PPp") : "No time specified"}
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">S.No</TableHead>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="text-right">Max Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {round.evaluation_pattern?.pattern?.map((pattern, patternIndex) => (
                  <TableRow key={patternIndex}>
                    <TableCell className="text-center">{patternIndex + 1}</TableCell>
                    <TableCell className="font-medium">{pattern.name}</TableCell>
                    <TableCell className="text-right">{pattern.max_marks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                onClick={() => handleDeleteRound(round.name)}
              >
                Delete Round
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

<Modal>
        <ModalTrigger className="bg-primary px-4 py-2 rounded-md">
          Open Evaluation Form
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Add Evaluation Round</h2>
              <div className="space-y-4">
                {/* Round Name */}
                <input
                  type="text"
                  placeholder="Round Name"
                  className="w-full border rounded-md px-3 py-2 dark:bg-secondary"
                  value={newRound.name}
                  onChange={(e) =>
                    setNewRound({ ...newRound, name: e.target.value })
                  }
                />

                {/* Round Time */}
                <DateTimePickerWithRange
                  onDateTimeChange={(date, startTime) =>
                    handleDateTimeChange(date?.from, startTime)
                  }
                  initialDateRange={{ from: new Date(), to: new Date() }}
                  initialStartTime="00:00"
                  initialEndTime="23:59"
                />

                {/* Add Evaluation Pattern */}
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full border rounded-md px-3 py-2 dark:bg-secondary"
                  value={newPattern.name}
                  onChange={(e) =>
                    setNewPattern({ ...newPattern, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Max Marks"
                  className="w-full border rounded-md px-3 py-2 dark:bg-secondary"
                  value={newPattern.max_marks}
                  onChange={(e) =>
                    setNewPattern({
                      ...newPattern,
                      max_marks: parseInt(e.target.value),
                    })
                  }
                />
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md dark:text-black"
                  onClick={handleAddPattern}
                >
                  Add Category
                </button>
              </div>

              {/* Evaluation Pattern Table */}
              <table className="w-full mt-6 border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">S.No</th>
                    <th className="border border-gray-300 px-4 py-2">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Max Marks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {newRound.evaluation_pattern?.pattern.map(
                    (pattern, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {pattern.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {pattern.max_marks}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <ModalFooter className="flex justify-end gap-4 mt-4">
              <button className="px-4 py-2 bg-gray-200 text-black rounded-md">
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md dark:text-black"
                onClick={handleAddRound}
              >
                Add Round
              </button>
            </ModalFooter>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AdminRoundEvaluation;