import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePickerWithRange } from '@/components/DateTimePickerWithRange';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

const CreateEventPage = () => {
  const [title, setTitle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [priceMoney, setPriceMoney] = useState(10000);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: new Date(), to: new Date() });
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("23:59");
  const [numRounds, setNumRounds] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDateTimeChange = (date: DateRange | undefined, startTime: string, endTime: string) => {
    setDateRange(date);
    setStartTime(startTime);
    setEndTime(endTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      title,
      banner_url: bannerUrl,
      description: description,
      price_money: priceMoney,
      start_time: dateRange?.from ? new Date(`${dateRange.from.toDateString()} ${startTime}`) : null,
      end_time: dateRange?.to ? new Date(`${dateRange.to.toDateString()} ${endTime}`) : null,
      num_rounds: numRounds,
    };

    try {
      // Send the event data to the backend
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        const resData = await response.json();
        // Show success toast
        toast({
          title: 'Success',
          description: resData.message || `${event.title} created successfully!`,
        });
        // Navigate to events page
        navigate('/events');
      } else {
        const errorData = await response.json();
        // Show error toast with message from response
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to create event',
        });
      }
    } catch (error) {
      // Show error toast with generic message
      toast({
        title: 'Error',
        description: `Failed to create event: ${error}`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl items-center bg-white dark:bg-black bg-opacity-50 rounded-md">
        <div className="hidden md:block">
          <img
            src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlM19waG90b19vZl9hX2JsYWNrX2Fic3RyYWN0X3dhbGxwYXBlcl9zaW1wbGVfYmxhY19lZmZjMDg5MS1jYjVjLTRjOTAtOTYzZS0yZDIxNDEyZDEwZTlfMS5qcGc.jpg"
            alt="Event"
            className="w-full h-full object-cover rounded-md"
            style={{ height: "550px" }}
          />
        </div>
        <div className="w-full max-w-md mx-auto items-stretch pr-5">
          <h1 className="text-2xl font-bold mt-[20px] mb-4 text-center">Create Hackathon</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Banner URL"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label className="block">
              <span className="text-gray-700">Price Money</span>
              <Input
                type="number"
                placeholder="Price Money"
                value={priceMoney}
                onChange={(e) => setPriceMoney(Number(e.target.value))}
                required
              />
            </label>
            <DateTimePickerWithRange onDateTimeChange={handleDateTimeChange} />
            <label className="block">
              <span className="text-gray-700">Number of Rounds</span>
              <Input
                type="number"
                placeholder="Number of Rounds"
                value={numRounds}
                onChange={(e) => setNumRounds(Number(e.target.value))}
                required
              />
            </label>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;