// import * as React from "react";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb"

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

    const renderContent = () => {
        switch (activeContent) {
            case "Overview":
                return (
                    <div>
                        <div>Event: {event.title}</div>
                        <div>Description: {event.description}</div>
                        <div>Price Money: ₹{event.price_money}</div>
                        <div>Start Time: {new Date(event.start_time).toLocaleString()}</div>
                    </div>
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
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        {renderContent()}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SingleEventPage;