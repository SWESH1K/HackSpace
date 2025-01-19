import { useState, useEffect } from 'react';

export interface Event {
  _id: string;
  title: string;
  banner_url: string;
  description: string;
  price_money: number;
  start_time: Date;
  end_time: Date;
  num_rounds: number;
  organiser: string;
  rounds: Round[];
  createdAt: Date;
  updatedAt: Date;
}

interface Round {
  number: number;
  name: string;
  max_marks: number;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/event');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Event) => {
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      if (data.success) {
        setEvents((prevEvents) => [...prevEvents, data.data]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error creating event');
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<Event>) => {
    try {
      const response = await fetch(`/api/event/${id}/updateEvent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      const data = await response.json();
      if (data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event._id === id ? data.data : event))
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error updating event');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deleting event');
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}