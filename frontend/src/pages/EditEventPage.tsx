import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePickerWithRange } from '@/components/DateTimePickerWithRange';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

interface EditEventPageProps {
    id: string;
}

const EditEventPage: React.FC<EditEventPageProps>  = ({id}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [priceMoney, setPriceMoney] = useState(10000);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("23:59");
  const [numRounds, setNumRounds] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [maxTeams, setMaxTeams] = useState(20);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        const data = await response.json();
        if (data.success) {
          const event = data.data[0];
          setTitle(event.title);
          setBannerUrl(event.banner_url);
          setThumbnailUrl(event.thumbnail_url);
          setDescription(event.description);
          setPriceMoney(event.price_money);
          setDateRange({
            from: new Date(event.start_time),
            to: new Date(event.end_time),
          });
          setStartTime(new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setEndTime(new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setNumRounds(event.num_rounds);
          setMaxTeamSize(event.max_team_size);
          setMaxTeams(event.max_teams);
        } else {
          toast({ title: 'Error', description: 'Failed to fetch event data' });
          navigate('/events');
        }
      } catch (error) {
        toast({ title: 'Error', description: `Failed to fetch event: ${error}` });
        navigate('/events');
      }
    };

    fetchEvent();
  }, [id, navigate, toast]);

  const handleDateTimeChange = (date: DateRange | undefined, startTime: string, endTime: string) => {
    setDateRange(date);
    setStartTime(startTime);
    setEndTime(endTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEvent = {
      title,
      banner_url: bannerUrl,
      description,
      price_money: priceMoney,
      start_time: dateRange?.from ? new Date(`${dateRange.from.toDateString()} ${startTime}`) : null,
      end_time: dateRange?.to ? new Date(`${dateRange.to.toDateString()} ${endTime}`) : null,
      num_rounds: numRounds,
      max_team_size: maxTeamSize,
      max_teams: maxTeams,
    };

    try {
      const response = await fetch(`/api/event/updateEvent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        const resData = await response.json();
        toast({ title: 'Success', description: resData.message || 'Event updated successfully!' });
        navigate(`/events`);
      } else {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.message || 'Failed to update event' });
      }
    } catch (error) {
      toast({ title: 'Error', description: `Failed to update event: ${error}` });
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl items-center bg-white dark:bg-black bg-opacity-50 rounded-md">
        <div className="hidden md:block">
          <img
            src={thumbnailUrl || 'https://via.placeholder.com/550'}
            alt="Event Banner"
            className="w-full h-full object-cover rounded-md"
            style={{ height: "550px", paddingInline: "30px" }}
          />
        </div>
        <div className="w-full max-w-md mx-auto items-stretch p-5">
          <h1 className="text-2xl font-bold mt-[20px] mb-4 text-center">Edit Hackathon</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <label className="block">
                <span className="text-gray-700">Banner URL</span>
                <Input
                  type="text"
                  placeholder="Banner URL"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  required
                />
            </label>
            <label className="block">
                <span className="text-gray-700">Thumbnail URL</span>
                <Input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  required
                />
            </label>
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
            <DateTimePickerWithRange
              onDateTimeChange={handleDateTimeChange}
              initialDateRange={dateRange}
              initialStartTime={startTime}
              initialEndTime={endTime}
            />
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
            <label className="block">
              <span className="text-gray-700">Max Team Size</span>
              <Input
                type="number"
                placeholder="Max Team Size"
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Max Teams</span>
              <Input
                type="number"
                placeholder="Max Teams"
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                required
              />
            </label>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;