import { ClockIcon } from "lucide-react";
import { format } from "date-fns";

interface EventTimeDisplayProps {
  startDate: Date;
  endDate: Date;
}

const EventTimeDisplay: React.FC<EventTimeDisplayProps> = ({ startDate, endDate }) => {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div className="flex space-x-4 items-center">
        <ClockIcon className="w-6 h-6 text-gray-500" />
        <span className="font-bold">{format(startDate, 'PPp')}</span>
        <span className="">to</span>
        <ClockIcon className="w-6 h-6 text-gray-500" />
        <span className="font-bold">{format(endDate, 'PPp')}</span>
      </div>
    </div>
  );
};

export default EventTimeDisplay;