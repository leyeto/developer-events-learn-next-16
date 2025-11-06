import {NextRequest, NextResponse} from "next/server";
import Event from "@/database/event.model"
import connectDB from "@/lib/mongodb";

export async function POST(req: NextRequest, res: NextResponse){
    try{

        await connectDB();

        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData);

        }catch(err){

        return NextResponse.json({message:"Invalid JSON data format"}, {status: 400})
        }
        const createdEvent = await Event.create(event);

        return NextResponse.json({message:"Successfully created event", event: createdEvent}, {status:201});

    }catch(err){
        console.error(err);
        return NextResponse.json({message:"Event Creation Failed", error: err instanceof Error ? err.message: "Unknown Error"});
    }
}