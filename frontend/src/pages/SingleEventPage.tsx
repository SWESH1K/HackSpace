// import * as React from "react";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import EventStatus from '@/components/EventStatus';
import PrizeMoney from '@/components/PriceMoney';
import ReactMarkdown from 'react-markdown';


const SingleEventPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeContent, setActiveContent] = useState<string>("Overview");

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

    useEffect(() => {
        if (error) {
            console.log("Invalid Event Id");
            navigate('/events');
        }
    }, [error, navigate]);

    if (!event) {
        return <div>Event not found</div>;
    }

    const renderDiv1Content = () => {
        switch (activeContent) {
            case "Overview":
                return (
                    <Card className="dark:bg-neutral-900 h-full w-full">
                        <CardContent className="h-full flex flex-col justify-center items-center">
                            <CardTitle className='text-center text-3xl mb-2'>Price Money</CardTitle>
                            <hr className="w-full border-t-1 border-gray-600 dark:border-gray-400 my-4" />
                            <PrizeMoney amount={event.price_money} />
                        </CardContent>
                    </Card>
                );
            case "Problem Statements":
                return <div>Problem Statements Content</div>;
            case "Rules and Instructions":
                return <div>Rules and Instructions Content</div>;
            case "Register":
                return <div>Register Content</div>;
            case "Participants":
                return <div>Participants Content</div>;
            case "Announcements":
                return <div>Announcements Content</div>;
            case "Result":
                return <div>Result Content</div>;
            default:
                return <div>Select a menu item to view content</div>;
        }
    };

    const renderDiv2Content = () => {
        if (!event) return null;
      
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);
      
        switch (activeContent) {
          case "Overview":
            return (
                <Card className="dark:bg-neutral-900 h-full w-full">
                    <CardContent className="h-full flex flex-col justify-center items-center">
                        <CardTitle className='text-center text-3xl mb-2'>Hackathon Status</CardTitle>
                        <hr className="w-full border-t-1 border-gray-600 dark:border-gray-400 my-4" />
                        <EventStatus startDate={startDate} endDate={endDate} />
                    </CardContent>
                </Card>
            );
          case "Problem Statements":
            return <div>Problem Statements Content</div>;
          case "Rules and Instructions":
            return <div>Rules and Instructions Content</div>;
          case "Register":
            return <div>Register Content</div>;
          case "Participants":
            return <div>Participants Content</div>;
          case "Announcements":
            return <div>Announcements Content</div>;
          case "Result":
            return <div>Result Content</div>;
          default:
            return <div>Select a menu item to view content</div>;
        }
      };

      const renderDiv3Content = () => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);
        const range: DateRange = { from: startDate, to: endDate };
    
        switch (activeContent) {
            case "Overview":
                return (
                    <Card className='dark:bg-neutral-900'>
                        <CardContent>
                            <div className="flex flex-col space-y-4 h-auto justify-center items-center">
                                <div className="flex justify-center items-center h-auto">
                                    <div className="w-full max-w-md h-auto">
                                        <Calendar
                                            selected={range}
                                            defaultMonth={startDate}
                                            fromMonth={startDate}
                                            toMonth={startDate}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>{format(startDate, 'PP')}</span>
                                    <ClockIcon className="ml-2 mr-1 w-4 h-4" />
                                    <span>{format(startDate, 'p')}</span>
                                    <span className='mx-2'>to</span>
                                    <span>{format(endDate, 'PP')}</span>
                                    <ClockIcon className=" ml-2 mr-1 w-4 h-4" />
                                    <span>{format(endDate, 'p')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            case "Problem Statements":
                return <div>Problem Statements Content</div>;
            case "Rules and Instructions":
                return <div>Rules and Instructions Content</div>;
            default:
                return <div>Select a menu item to view content</div>;
        }
    };

    const renderMainContent = () => {
        switch (activeContent) {
            case "Overview":
    return (
        <Card>
            <CardHeader>
                <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ReactMarkdown>{event.overview}</ReactMarkdown>
            </CardContent>
        </Card>
    );
    case "Problem Statements":
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Problem Statements</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReactMarkdown>{event.problem_statements}</ReactMarkdown>
                </CardContent>
            </Card>
        );
    case "Rules and Instructions":
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Rules and Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReactMarkdown>{event.rules_and_regulations}</ReactMarkdown>
                </CardContent>
            </Card>
        );
        case "Register":
            return <div>Register Content</div>;
        case "Participants":
            return <div>Participants Content</div>;
        case "Announcements":
            return <div>Announcements Content</div>;
        case "Result":
            return <div>Result Content</div>;
        default:
            return <div>Select a menu item to view content</div>;
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar onMenuItemClick={setActiveContent} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/events">Events</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{event.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 items-stretch">
                        <div className="rounded-xl bg-muted/50 flex items-stretch">{renderDiv1Content()}</div>
                        <div className="rounded-xl bg-muted/50 flex items-stretch">{renderDiv2Content()}</div>
                        <div className="rounded-xl bg-muted/50 flex items-stretch justify-center py-3">{renderDiv3Content()}</div>
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        {renderMainContent()}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SingleEventPage;