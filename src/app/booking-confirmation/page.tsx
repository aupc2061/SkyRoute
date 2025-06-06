"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Plane, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { generateTicketPDF } from "@/utils/generateTicketPDF";
import { useSession } from "next-auth/react";

interface Flight {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get flight data from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    if (!flightData) {
      toast({
        title: "No Flight Selected",
        description: "Please select a flight first.",
        variant: "destructive",
      });
      router.push('/flight-search');
      return;
    }

    try {
      const parsedFlight = JSON.parse(decodeURIComponent(flightData));
      setFlight(parsedFlight);
    } catch (error) {
      console.error('Error parsing flight data:', error);
      toast({
        title: "Error",
        description: "Invalid flight data. Please try again.",
        variant: "destructive",
      });
      router.push('/flight-search');
    }
  }, [router, toast]);

  useEffect(() => {
    // Fetch user data when session is available
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/users/profile');
          const data = await response.json();
          if (data.name) {
            setUserName(data.name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleDownloadTicket = () => {
    try {
      if (!flight) return;

      // Generate and download PDF ticket with user name
      generateTicketPDF(flight, userName);
      
      // Show success message
      toast({
        title: "Ticket Downloaded!",
        description: "Your ticket has been downloaded successfully.",
        variant: "default",
        duration: 3000,
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!flight) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/flight-search">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Download Your Ticket</CardTitle>
            <CardDescription>Review your flight details and download your ticket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passenger Information */}
            <div className="p-4 border rounded-lg bg-muted/10">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <span className="font-semibold">Passenger</span>
              </div>
              <div className="text-lg">{userName || "Loading..."}</div>
            </div>

            {/* Flight Summary */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{flight.itineraries[0].segments[0].departure.iataCode}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(flight.itineraries[0].segments[0].departure.at), 'HH:mm')}
                  </div>
                </div>
                <Plane className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at), 'HH:mm')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{flight.price.currency} {flight.price.total}</div>
                <div className="text-sm text-muted-foreground">Total Price</div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="space-y-4">
              {flight.itineraries[0].segments.map((segment) => (
                <div 
                  key={`${segment.carrierCode}-${segment.number}-${segment.departure.at}`} 
                  className="p-4 border rounded-lg"
                >
                  <div className="font-semibold mb-2">Flight {segment.carrierCode} {segment.number}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div>{segment.departure.iataCode}</div>
                      <div className="text-sm">{format(new Date(segment.departure.at), 'MMM d, yyyy HH:mm')}</div>
                      {segment.departure.terminal && (
                        <div className="text-sm">Terminal {segment.departure.terminal}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div>{segment.arrival.iataCode}</div>
                      <div className="text-sm">{format(new Date(segment.arrival.at), 'MMM d, yyyy HH:mm')}</div>
                      {segment.arrival.terminal && (
                        <div className="text-sm">Terminal {segment.arrival.terminal}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleDownloadTicket}
            >
              Download Ticket
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 