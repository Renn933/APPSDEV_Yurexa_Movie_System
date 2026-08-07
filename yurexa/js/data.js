// Yurexa Movie Data
// All content is rendered from this data — never copy-pasted HTML.

const MOVIES = [
  {
    id: 1,
    title: "Neon Horizon",
    year: 2024,
    rating: 8.7,
    runtime: 142,
    genre: "Sci-Fi",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    price: 9.99,
    description: "In a neon-drenched metropolis, a rogue data courier discovers a signal that could rewrite the fabric of reality itself.",
    cast: ["Ava Chen", "Marcus Reed", "Lena Ortiz"],
    featured: true,
    releaseDate: "2024-03-15"
  },
  {
    id: 2,
    title: "Crimson Tide Rising",
    year: 2025,
    rating: 9.1,
    runtime: 155,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=80",
    price: 12.99,
    description: "A retired naval officer is pulled back into duty when a rogue submarine threatens global security.",
    cast: ["Derek Storm", "Isabella Fuentes", "Tom Ngoran"],
    featured: true,
    releaseDate: "2025-01-10"
  },
  {
    id: 3,
    title: "The Silent Garden",
    year: 2023,
    rating: 7.9,
    runtime: 118,
    genre: "Drama",
    poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    price: 7.99,
    description: "A grieving botanist finds solace in an abandoned greenhouse that holds the secrets of her family's past.",
    cast: ["Yuki Tanaka", "Sarah Whitmore"],
    featured: false,
    releaseDate: "2023-09-22"
  },
  {
    id: 4,
    title: "Chronicles of Ash",
    year: 2025,
    rating: 8.4,
    runtime: 168,
    genre: "Fantasy",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&q=80",
    price: 14.99,
    description: "In a world reduced to embers, the last firekeeper must journey across the ash wastes to relight the sun.",
    cast: ["Orin Blackwood", "Mei-Lin Wang", "Kofi Annan"],
    featured: true,
    releaseDate: "2025-04-05"
  },
  {
    id: 5,
    title: "Velvet Deception",
    year: 2024,
    rating: 8.1,
    runtime: 126,
    genre: "Thriller",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?w=1200&q=80",
    price: 9.99,
    description: "A con artist's biggest heist goes wrong when she falls for her mark — an enigmatic art dealer with secrets of his own.",
    cast: ["Claudia Moreau", "Victor Hale", "Priya Sharma"],
    featured: false,
    releaseDate: "2024-07-19"
  },
  {
    id: 6,
    title: "Starlight Protocol",
    year: 2024,
    rating: 8.9,
    runtime: 134,
    genre: "Sci-Fi",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    price: 11.99,
    description: "A team of astronauts intercepts a transmission from a dying star — and what they hear will change humanity forever.",
    cast: ["Elena Vasquez", "Jamal Carter", "Dr. Hannah Reed"],
    featured: true,
    releaseDate: "2024-11-08"
  },
  {
    id: 7,
    title: "The Last Lullaby",
    year: 2023,
    rating: 7.6,
    runtime: 108,
    genre: "Horror",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&q=80",
    price: 6.99,
    description: "A children's music therapist hears a melody in her sessions that no one else can — and it's calling her.",
    cast: ["Rachel Yuen", "Gabriel Moss"],
    featured: false,
    releaseDate: "2023-10-31"
  },
  {
    id: 8,
    title: "Midnight Circuit",
    year: 2025,
    rating: 8.2,
    runtime: 131,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    price: 10.99,
    description: "An underground street racer becomes the target of a criminal syndicate after winning a race he was never supposed to enter.",
    cast: ["Diego Ramos", "Ariana Lee", "Marcus Webb"],
    featured: false,
    releaseDate: "2025-02-14"
  },
  {
    id: 9,
    title: "Echoes of Tomorrow",
    year: 2024,
    rating: 8.5,
    runtime: 147,
    genre: "Drama",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=1200&q=80",
    price: 8.99,
    description: "A composer who lost his hearing struggles to finish his magnum opus while reconnecting with his estranged daughter.",
    cast: ["Arthur Finch", "Nadia Petrova", "Chris Lane"],
    featured: true,
    releaseDate: "2024-06-01"
  },
  {
    id: 10,
    title: "Blood and Rust",
    year: 2023,
    rating: 7.8,
    runtime: 122,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    price: 7.99,
    description: "In a post-apocalyptic wasteland, a scavenger must repair a derelict mech to protect her settlement from raiders.",
    cast: ["Rex Whitfield", "Tara Nguyen", "Omar Haddad"],
    featured: false,
    releaseDate: "2023-05-20"
  },
  {
    id: 11,
    title: "Aurora's Promise",
    year: 2025,
    rating: 9.0,
    runtime: 139,
    genre: "Fantasy",
    poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1516634307471-b207a5dd5c1d?w=1200&q=80",
    price: 12.99,
    description: "When the northern lights begin fading, a young cartographer embarks on a quest to restore the sky's colors.",
    cast: ["Freya Lindqvist", "Bjorn Sorensen", "Selma Aydin"],
    featured: true,
    releaseDate: "2025-03-28"
  },
  {
    id: 12,
    title: "Shattered Glass",
    year: 2024,
    rating: 8.3,
    runtime: 115,
    genre: "Thriller",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    price: 9.99,
    description: "A forensic photographer uncovers a pattern linking a series of 'accidental' deaths that everyone dismissed.",
    cast: ["Gwen Sullivan", "Michael Chase", "Rosa Diaz"],
    featured: false,
    releaseDate: "2024-09-13"
  },
  {
    id: 13,
    title: "Whispering Pines",
    year: 2023,
    rating: 7.4,
    runtime: 104,
    genre: "Drama",
    poster: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80",
    price: 6.99,
    description: "Two estranged brothers inherit a failing lakeside resort and must decide whether to save it or let it go.",
    cast: ["Henry Wood", "Sam Bergmann"],
    featured: false,
    releaseDate: "2023-11-17"
  },
  {
    id: 14,
    title: "Quantum Heist",
    year: 2025,
    rating: 8.8,
    runtime: 143,
    genre: "Sci-Fi",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    price: 13.99,
    description: "A crew of quantum physicists plans the impossible: stealing a secret from a future that hasn't happened yet.",
    cast: ["Dr. Felix Brandt", "Ivy Nakamura", "Pauline Dubois"],
    featured: false,
    releaseDate: "2025-05-30"
  },
  {
    id: 15,
    title: "Garden of Shadows",
    year: 2024,
    rating: 8.0,
    runtime: 128,
    genre: "Horror",
    poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80",
    price: 8.99,
    description: "A landscape architect discovers that the formal garden she's restoring was designed to keep something buried.",
    cast: ["Beatrice Holloway", "Jonas Kessler", "Maya Patel"],
    featured: false,
    releaseDate: "2024-08-02"
  },
  {
    id: 16,
    title: "Iron Will",
    year: 2025,
    rating: 8.6,
    runtime: 149,
    genre: "Action",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80",
    price: 12.99,
    description: "A blacksmith's daughter takes up her father's hammer to forge a weapon capable of ending a century-long war.",
    cast: ["Brunhilde Ironheart", "Erik Olsen", "Livia Moretti"],
    featured: true,
    releaseDate: "2025-06-21"
  }
];

// Genres derived from MOVIES data
const GENRES = [...new Set(MOVIES.map(movie => movie.genre))].sort();

// Sample user reviews (data-driven)
const REVIEWS = {
  1: [
    { author: "Cinephile92", text: "Stunning visuals and a gripping story. The best sci-fi of the year!", rating: 9 },
    { author: "MovieMaven", text: "Neon Horizon is a visual feast. Highly recommended.", rating: 8.5 }
  ],
  4: [
    { author: "FantasyFan", text: "Epic world-building. The firekeeper's journey is unforgettable.", rating: 9.5 }
  ],
  6: [
    { author: "AstroNerd", text: "Smart, emotional, and beautifully shot. A must-watch.", rating: 9 }
  ]
};