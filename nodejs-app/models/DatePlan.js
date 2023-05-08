import mongoose from "mongoose";
import { Schema } from "mongoose";
import Place from "./Place.js";
import Bill from "./Bill.js";

const DatePlanSchema = new mongoose.Schema({
  channelId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Channel",
  },
  date: {
    type: String,
    required: true,
  },
});

// middleware
DatePlanSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // Place
    const placesInThisDatePlan = await Place.find({ datePlanId: this._id });
    await Promise.all(
      placesInThisDatePlan.map(async (place) => await place.deleteOne())
    );

    // Bill
    const billsInThisDatePlan = await Bill.find({ datePlanId: this._id });
    await Promise.all(
      billsInThisDatePlan.map(async (bill) => await bill.deleteOne())
    );

    next();
  }
);

export default mongoose.model("DatePlan", DatePlanSchema);
