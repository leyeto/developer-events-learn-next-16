import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to validate that the referenced Event exists
 * Throws an error if the event is not found in the database
 */
bookingSchema.pre("save", async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's modified or document is new
  if (booking.isModified("eventId")) {
    try {
      const eventExists = await Event.findById(booking.eventId);

      if (!eventExists) {
        return next(new Error("Referenced event does not exist"));
      }

      next();
    } catch (error) {
      return next(
        error instanceof Error ? error : new Error("Error validating event"),
      );
    }
  } else {
    next();
  }
});

// Prevent model recompilation in development
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
