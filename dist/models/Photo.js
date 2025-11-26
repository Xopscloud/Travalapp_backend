import mongoose from 'mongoose';
const photoSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    context: { type: String, enum: ['gallery', 'destination'], required: true },
    destinationSlug: { type: String },
    originalName: { type: String },
    uploadedBy: { type: String, default: 'Admin' }
}, { timestamps: true });
export const PhotoModel = mongoose.models.Photo ?? mongoose.model('Photo', photoSchema);
