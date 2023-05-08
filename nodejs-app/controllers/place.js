import { createError } from "../utils/error.js";
import Place from "../models/Place.js";
import DatePlan from "../models/DatePlan.js";
import Channel from "../models/Channel.js";

export const createPlace = async (req, res, next) => {
  const newPlace = new Place({
    datePlanId: req.params.datePlanId,
    ...req.body,
  });
  try {
    const datePlan = await DatePlan.findById(req.params.datePlanId);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(createError(403, "You need to join this channel first"));

    const savedPlace = await newPlace.save();
    res.status(200).json(savedPlace);
  } catch (err) {
    next(err);
  }
};

export const getAllPlaces = async (req, res, next) => {
  try {
    const datePlan = await DatePlan.findById(req.params.datePlanId);
    if (!datePlan) return next(createError(404, "Date Plan not found"));

    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only view the places in your channel")
      );

    const places = await Place.find({ datePlanId: req.params.datePlanId });
    res.status(200).json(places);
  } catch (err) {
    next(err);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(createError(404, "Place not found"));

    const datePlan = await DatePlan.findById(place.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only view the places in your channel")
      );
		res.status(200).json(place);
  } catch (err) {
    next(err);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(createError(404, "Place not found"));

    const datePlan = await DatePlan.findById(place.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only update the place in your channel")
      );

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPlace);
  } catch (err) {
    next(err);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(createError(404, "Place not found"));

    const datePlan = await DatePlan.findById(place.datePlanId);
    const channel = await Channel.findById(datePlan.channelId);
    if (!channel.members.includes(req.user.id))
      return next(
        createError(403, "You can only delete the place in your channel")
      );

    await place.deleteOne();
    res.status(200).json("The place has been deleted");
  } catch (err) {
    next(err);
  }
};
