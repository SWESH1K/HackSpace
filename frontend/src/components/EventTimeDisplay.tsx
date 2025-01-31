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
        <ClockIcon className="w-12 h-12 text-gray-500" />
        <span className="text-2xl">{format(startDate, 'PPpp')}</span>
        <span className="text-2xl">to</span>
        <ClockIcon className="w-12 h-12 text-gray-500" />
        <span className="text-2xl">{format(endDate, 'PPpp')}</span>
      </div>
    </div>
  );
};

export default EventTimeDisplay;