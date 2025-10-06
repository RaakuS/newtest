const library = [
  { id: 1, topic: 'bees', url: 'https://example.com/assets/bee1.mp4' },
  { id: 2, topic: 'water-cycle', url: 'https://example.com/assets/water1.mp4' },
  { id: 3, topic: 'emotions', url: 'https://example.com/assets/emotion1.mp4' },
  { id: 4, topic: 'plants', url: 'https://example.com/assets/plant1.mp4' },
  { id: 5, topic: 'recycling', url: 'https://example.com/assets/recycle1.mp4' }
];

export function findAssets(topic) {
  return library.filter(a => a.topic === topic);
}

export const topics = [
  { value: 'bees', label: 'How bees carry pollen' },
  { value: 'water-cycle', label: 'The water cycle' },
  { value: 'emotions', label: 'Understanding emotions' },
  { value: 'plants', label: 'How plants grow' },
  { value: 'recycling', label: 'Why we recycle' }
];
