import EventTimeDisplay from "@/components/EventTimeDisplay";
import PrizeMoney from '@/components/PriceMoney';

interface EventProps {
  title: string;
  start_time: Date;
  end_time: Date;
  description: string;
  price_money: number;
}

interface OverviewProps {
  event: EventProps;
}

const Overview = ({ event }: OverviewProps) => {
  return (
    <>
        <div className="relative h-[400px]">
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(https://media.istockphoto.com/id/1216719230/vector/hackathon-logo.jpg?s=612x612&w=0&k=20&c=zQVEAPPXIbDpwTF1IIEhGuw3q53H06o4ojNqP59Ri78=` }}
            ></div>
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
                <h1 className="text-4xl font-bold relative z-10">
                    <span className="bg-opacity-50 px-2 py-1">{event.title}</span>
                </h1>
                <EventTimeDisplay startDate={event.start_time} endDate={event.end_time} />
            </div>
        </div>
        <div className="h-full">
            <div className='m-3'>
                <h2 className='text-2xl font-bold mb-3'>Description</h2>
                <PrizeMoney amount={event.price_money} />
                <p className='mt-4'>{event.description}</p>
            </div>
        </div>
    </>
  )
}

export default Overview