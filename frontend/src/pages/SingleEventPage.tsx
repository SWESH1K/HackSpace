// import * as React from "react";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb"
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {format} from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"  
import remarkGfm from "remark-gfm"
import styles from "../SingleEventPage.module.css"
import EventTimeDisplay from "@/components/EventTimeDisplay";
import PrizeMoney from '@/components/PriceMoney';

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
                console.log(data);
                if (data.success) {
                    setEvent(data.data[0]);
                }
                console.log(data);
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

    const renderMainContent = () => {
        switch (activeContent) {
            case "Overview":
                return (
                    <div>
                        <div className="relative h-[400px]">
                            <div
                                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(https://media.istockphoto.com/id/1216719230/vector/hackathon-logo.jpg?s=612x612&w=0&k=20&c=zQVEAPPXIbDpwTF1IIEhGuw3q53H06o4ojNqP59Ri78=` }}
                            ></div>
                            <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
                                <h1 className="text-4xl font-bold relative z-10">
                                    <span className="bg-opacity-50 px-2 py-1">{event.title}</span>
                                </h1>
                                <EventTimeDisplay startDate={new Date(event.start_time)} endDate={new Date(event.end_time)} />
                            </div>
                        </div>
                        <div className="h-full">
                            <div className='m-3'>
                                <h2 className='text-2xl font-bold mb-3'>Description</h2>
                                <PrizeMoney amount={event.price_money} />
                                <p className='mt-4'>{event.description}</p>
                            </div>
                        </div>
                    </div>
                );
            case "Problem Statements":
                return (
                    <div className={styles.markdown}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.problem_statements}</ReactMarkdown>
                    </div>
                );
            case "Rules and Instructions":
                return(
                    <div className={styles.markdown}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.rules_and_regulations}</ReactMarkdown>
                    </div>
                );
            case "Register":
                return <div>Register Content</div>;
            case "Participants":
                return <div>Participants Content</div>;
            case "Announcements":
                return <div>Announcements Content</div>;
            case "Result":
                return <div>Result Content</div>;
            case "Problem-Statements":
                return <div>Problem Statements</div>;
            case "Rounds-Evaluation":
                return (
                    <div>
                        {event.rounds.map((round, index) => (
                            <Card key={index} className="mb-4">
                                <CardHeader>
                                    <div className='flex justify-between'>
                                        <h3 className="text-lg font-semibold">{round.name}</h3>
                                        <h3>{round.max_marks} Marks</h3>
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                        {format(new Date(round.time), 'PPp')}
                                    </div>
                                </CardHeader>
                                <Separator />
                                <CardContent>
                                        <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="w-[30px]">S.No</TableHead>
                                            <TableHead className="w-[200px]">Category</TableHead>
                                            <TableHead className='text-right'>Max Marks</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {round.evaluation_pattern.pattern.map((pattern, patternIndex) => (
                                            <TableRow>
                                                <TableCell className='text-center'>{patternIndex+1}</TableCell>
                                                <TableCell className="font-medium">{pattern.name}</TableCell>
                                                <TableCell className="text-right">{pattern.max_marks}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                        </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );
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
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        {renderMainContent()}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SingleEventPage;