import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb"

import Overview from './Overview';
import AdminProblemStatements from './AdminProblemStatements';
import ProblemStatements from './ProblemStatements';
import RulesRegulations from './RulesRegulations';
import RoundEvaluation from './RoundEvaluation';
import Announcements from './Announcements';
import Registrations from './Registrations';
import Participants from './Participants';
import ResultPage from './ResultPage';
import { useUser } from '@/hooks/useUser';
import AdminRulesRegulations from './AdminRulesRegulations';

const SingleEventPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeContent, setActiveContent] = useState<string>("Overview");
    const user = useUser();

    if(!user) {
        navigate('/login', {replace: true})
    }
    
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
    
    console.log(`User: ${user}, Hackathon-Admin: ${event.admin}`)
    const renderMainContent = () => {
        switch (activeContent) {
            case "Overview":
                return <Overview event={event}/>
            case "Problem Statements":
                return <ProblemStatements event={event}/>
            case "Rules and Instructions":
                return <RulesRegulations event={event}/>
            case "Register":
                return <Registrations />;
            case "Participants":
                return <Participants />
            case "Announcements":
                return <Announcements />;
            case "Result":
                return <ResultPage />;
            case "Problem-Statements":
                return <AdminProblemStatements event={event} />
            case "Rules-and-Instructions":
                return <AdminRulesRegulations event={event} />
            case "Rounds-Evaluation":
                return <RoundEvaluation event={event}/>
            default:
                return <div>Select a menu item to view content</div>;
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar 
                onMenuItemClick={setActiveContent}
                userId={user?.sub}
                hackathonAdminId={event.admin}
            />
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