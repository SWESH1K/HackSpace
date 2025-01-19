"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateTimePickerWithRange({
  className,
  onDateTimeChange,
}: React.HTMLAttributes<HTMLDivElement> & { onDateTimeChange: (date: DateRange | undefined, startTime: string, endTime: string) => void }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  })
  const [startTime, setStartTime] = React.useState<string>("00:00")
  const [endTime, setEndTime] = React.useState<string>("23:59")

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    onDateTimeChange(date, startTime, endTime);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    onDateTimeChange(date, e.target.value, endTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    onDateTimeChange(date, startTime, e.target.value);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full max-w-[440px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-gray-700">Start Time</label>
          <div className="relative">
            <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="w-full pl-8 pr-2 py-1 border rounded-md bg-white dark:bg-black"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700">End Time</label>
          <div className="relative">
            <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="w-full pl-8 pr-2 py-1 border rounded-md bg-white dark:bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}