import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';

const SingleEventPage = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const url = `/api/event/${id}`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.success) {
                    setEvent(data.data[0]);
                } else {
                    setError(data.message);
                }
            } catch (e) {
                console.log(`Error: ${e}`);
                setError('Failed to fetch event');
            }
        };

        fetchEvent();
    }, [id]);

    if (error) {
        console.log("Invalid Event Id")
        navigate('/events')
    }

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="min-h-screen w-full">
            <div>Event: {event.title}</div>
        </div>
    );
};

export default SingleEventPage;