import EventDetailView from "@/components/organizer/events/id";
import React from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const EventDetailPage = async ({ params }: Props) => {
  return <EventDetailView params={await params} />;
};

export default EventDetailPage;
