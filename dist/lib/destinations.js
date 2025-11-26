import { MomentModel } from '@/models/Moment.js';
import { slugify } from '@/utils/slugify.js';
function buildDestinationSummaries(momentDocs) {
    const map = new Map();
    for (const moment of momentDocs) {
        const slug = slugify(moment.location) || moment.location.toLowerCase().replace(/\s+/g, '-');
        const latestCreatedAt = moment.createdAt ? moment.createdAt.getTime() : Date.now();
        const existing = map.get(slug);
        if (existing) {
            existing.entryCount += 1;
            existing.travelers.add(moment.traveler);
            if (latestCreatedAt > existing.latestCreatedAt) {
                existing.latestCreatedAt = latestCreatedAt;
                existing.coverUrl = moment.photoUrl;
            }
        }
        else {
            map.set(slug, {
                location: moment.location,
                coverUrl: moment.photoUrl,
                entryCount: 1,
                travelers: new Set([moment.traveler]),
                latestCreatedAt
            });
        }
    }
    return Array.from(map.entries())
        .sort((a, b) => b[1].latestCreatedAt - a[1].latestCreatedAt)
        .map(([slug, summary]) => ({
        slug,
        location: summary.location,
        coverUrl: summary.coverUrl,
        entryCount: summary.entryCount,
        travelers: Array.from(summary.travelers)
    }));
}
export async function getDestinationSummaries() {
    const moments = await MomentModel.find({}, { location: 1, photoUrl: 1, traveler: 1, createdAt: 1 }).lean();
    return buildDestinationSummaries(moments.map((moment) => ({
        location: moment.location,
        photoUrl: moment.photoUrl,
        traveler: moment.traveler,
        createdAt: moment.createdAt ?? new Date()
    })));
}
export async function getDestinationBySlug(slug) {
    const summaries = await getDestinationSummaries();
    return summaries.find((summary) => summary.slug === slug) ?? null;
}
