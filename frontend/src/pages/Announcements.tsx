import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { MessageCard } from "../components/MessageCard";
import { useUser } from "@/hooks/useUser";
import { SendHorizonal, MoreVertical } from "lucide-react"; // Import the Send icon from Lucide
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Event } from "@/hooks/useEvents";

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  createdByUser: string;
  createdByUserID: string;
  createdByUserProfile: string;
}

export const Announcements = ({ event}: { event:Event}) => {
  const hackathonId = event._id;
  const hackathonName = event.title;
  const hackathonAdmin = event.admin;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const messagesCollection = collection(db, `hackathons/${hackathonId}/messages`);
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const messagesList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          createdByUser: doc.data().createdByUser,
          createdByUserID: doc.data().createdByUserID,
          createdByUserProfile: doc.data().createdByUserProfile,
        })) as Message[];
  
      // Sort messages by createdAt in ascending order
      messagesList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
      setMessages(messagesList);
      setLoading(false);
      if(messages.length > 10){
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, (error) => {
      console.error("Error listening to messages:", error);
      setLoading(false);
    });
  
    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [hackathonId]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const messageDocRef = doc(db, `hackathons/${hackathonId}/messages`, messageId); // Reference to the specific message document
      await deleteDoc(messageDocRef); // Delete the document from Firestore
  
      // Update the messages state after deletion
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageData = {
      text: newMessage,
      createdAt: new Date(),
      createdByUser: currentUser?.name,
      createdByUserID: currentUser?.sub,
      createdByUserProfile: currentUser?.picture,
    };

    try {
      const messagesCollection = collection(db, `hackathons/${hackathonId}/messages`);
      await addDoc(messagesCollection, newMessageData);

      setNewMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col h-screen">
      <h2 className="text-xl text-center mt-2 font-bold mb-4">{hackathonName}</h2>
      <h1 className="text-2xl text-center mt-2 font-bold mb-4">Announcements Section</h1>
  
      {/* Messages Section */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.id} className="flex items-center justify-between">
            <MessageCard
              profileImage={message.createdByUserProfile}
              userName={message.createdByUser}
              messageText={message.text}
              createdAt={message.createdAt}
            />
            {(message.createdByUserID === currentUser?.sub || hackathonAdmin == currentUser?.sub) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-red-500"
                  >
                    Delete Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
        <div ref={bottomRef} />
      </div>

  
      {/* Message Input Box */}
      <div className="sticky bottom-0 left-0 light:bg-white border-t mt-10 p-4 flex items-center space-x-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-grow border rounded px-2 py-1"
        />
        <button
          onClick={handleCreateMessage}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-950 text-white"
        >
          <SendHorizonal className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};