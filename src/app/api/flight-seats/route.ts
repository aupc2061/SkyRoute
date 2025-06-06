import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { FlightSeat } from '@/models/FlightSeat';

// Get available seats for a flight
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get('flightNumber');

    if (!flightNumber) {
      return NextResponse.json(
        { error: 'Flight number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const flightSeat = await FlightSeat.findOne({ flightNumber });
    
    if (!flightSeat) {
      // If no document exists, all seats are available
      return NextResponse.json({ 
        availableSeats: 30,
        nextAvailableSeat: 1
      });
    }

    return NextResponse.json({
      availableSeats: flightSeat.getAvailableSeatsCount(),
      nextAvailableSeat: flightSeat.getNextAvailableSeat()
    });

  } catch (error) {
    console.error('Flight seats error:', error);
    return NextResponse.json(
      { error: 'Failed to get flight seats' },
      { status: 500 }
    );
  }
}

// Assign a seat for a booking
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to book seats' },
        { status: 401 }
      );
    }

    const { flightNumber } = await request.json();

    if (!flightNumber) {
      return NextResponse.json(
        { error: 'Flight number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find or create flight seat document
    let flightSeat = await FlightSeat.findOne({ flightNumber });
    
    if (!flightSeat) {
      flightSeat = new FlightSeat({
        flightNumber,
        takenSeats: [1] // Take the first seat if new document
      });
    } else {
      const nextSeat = flightSeat.getNextAvailableSeat();
      if (!nextSeat) {
        return NextResponse.json(
          { error: 'No seats available' },
          { status: 400 }
        );
      }
      flightSeat.takenSeats.push(nextSeat);
    }

    await flightSeat.save();

    return NextResponse.json({
      success: true,
      seatNumber: flightSeat.takenSeats[flightSeat.takenSeats.length - 1],
      availableSeats: flightSeat.getAvailableSeatsCount()
    });

  } catch (error) {
    console.error('Flight seat assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to assign seat' },
      { status: 500 }
    );
  }
} 