import Mood from './Mood'

export interface MoodItem {
  image: string;
  title: string;
  description: string;
}

export const moodList: MoodItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Energetic Vibes',
    description: 'Feel the energy with these upbeat tunes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Chill Waves',
    description: 'Relax and unwind with calming melodies.'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    title: 'Coffeehouse Jams',
    description: 'Perfect background music for your coffee break.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Dreamy Nights',
    description: 'Soothing sounds for late-night relaxation.'
  },
  {
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    title: 'Sunny Mornings',
    description: 'Start your day with bright, uplifting tunes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
    title: 'Focus Flow',
    description: 'Stay productive with focused instrumentals.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Rainy Day',
    description: 'Cozy up with mellow, rainy day music.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Party Time',
    description: 'Get the party started with these hits.'
  }
];

const Home = () => {
  return (
    <div className="mood-list flex flex-wrap gap-9 justify-center items-start">
      {moodList.map((mood: MoodItem, idx: number) => (
        <Mood key={idx} image={mood.image} title={mood.title} description={mood.description} />
      ))}
    </div>
  )
}

export default Home 