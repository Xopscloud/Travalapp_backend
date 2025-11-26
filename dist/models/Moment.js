import mongoose from 'mongoose';
const momentSchema = new mongoose.Schema({
    traveler: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, required: true },
    travelDate: { type: Date, required: true },
    tags: [{ type: String }],
    mood: { type: String, enum: ['relaxed', 'thrill', 'culture', 'foodie', 'nature'], required: true },
    weather: { type: String, required: true }
}, { timestamps: true });
export const MomentModel = mongoose.models.Moment ?? mongoose.model('Moment', momentSchema);
