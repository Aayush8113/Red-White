require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');

const seedData = [
  {
    "productionDetails": {
      "movieTitle": "The Last Symbiote",
      "director": "Kelly Marcel",
      "leadActor": "Tom Hardy"
    },
    "releaseMetrics": {
      "releaseDate": "2024-10-25",
      "runtime": 110,
      "language": "English",
      "ticketPrice": 450,
      "criticalRating": 7.8,
      "genre": ["Sci-Fi", "Action"]
    },
    "creativeTeam": {
      "producer": "Avi Arad",
      "musicDirector": "Ludwig Göransson",
      "missionBrief": "Eddie Brock and Venom are on the run. Hunted by both their worlds, the duo is forced into a devastating decision that will bring the curtains down on their last dance.",
      "aiSummarize": "A high-stakes finale featuring a symbiotic bond tested by intergalactic threats and military pursuit."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_venom",
      "teaserUrl": "https://youtube.com/shorts/mock_venom_teaser"
    },
    "ratingExperience": {
      "ageRating": "UA",
      "experienceFormat": "IMAX Experience",
      "intensity": {
        "violence": 7,
        "profanity": 5,
        "substanceUse": 2
      },
      "arVrSupport": true
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Mickey 17",
      "director": "Bong Joon-ho",
      "leadActor": "Robert Pattinson"
    },
    "releaseMetrics": {
      "releaseDate": "2025-01-31",
      "runtime": 128,
      "language": "English",
      "ticketPrice": 500,
      "criticalRating": 8.9,
      "genre": ["Sci-Fi", "Drama"]
    },
    "creativeTeam": {
      "producer": "Dede Gardner",
      "musicDirector": "Jung Jae-il",
      "missionBrief": "An 'expendable' employee sent to colonize an ice world refuses to let his replacement clone take his place after a survival accident.",
      "aiSummarize": "A philosophical sci-fi journey about identity, mortality, and the value of a single life in a corporate-run universe."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_mickey",
      "teaserUrl": "https://youtube.com/shorts/mock_mickey_teaser"
    },
    "ratingExperience": {
      "ageRating": "PG-13",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 4,
        "profanity": 3,
        "substanceUse": 1
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Black Bag",
      "director": "Steven Soderbergh",
      "leadActor": "Cate Blanchett"
    },
    "releaseMetrics": {
      "releaseDate": "2025-03-14",
      "runtime": 115,
      "language": "English",
      "ticketPrice": 350,
      "criticalRating": 9.1,
      "genre": ["Action", "Thriller"]
    },
    "creativeTeam": {
      "producer": "Casey Silver",
      "musicDirector": "Cliff Martinez",
      "missionBrief": "Two elite intelligence agents find their marriage crumbling as a high-stakes conspiracy suggests one of them is a double agent.",
      "aiSummarize": "A sleek, intense espionage thriller blending domestic drama with international stakes."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_blackbag",
      "teaserUrl": "https://youtube.com/shorts/mock_blackbag_teaser"
    },
    "ratingExperience": {
      "ageRating": "A",
      "experienceFormat": "Digital 3D",
      "intensity": {
        "violence": 6,
        "profanity": 7,
        "substanceUse": 4
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Blink Twice",
      "director": "Zoë Kravitz",
      "leadActor": "Channing Tatum"
    },
    "releaseMetrics": {
      "releaseDate": "2024-08-23",
      "runtime": 102,
      "language": "English",
      "ticketPrice": 400,
      "criticalRating": 7.5,
      "genre": ["Thriller", "Horror"]
    },
    "creativeTeam": {
      "producer": "Bruce Cohen",
      "musicDirector": "Chanda Dancy",
      "missionBrief": "A tech billionaire invites a cocktail waitress to his private island for a luxury getaway, but things take a dark, psychological turn.",
      "aiSummarize": "A suspenseful and unsettling examination of power, memory, and survival in paradise."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1598899139109-5152c42b0b36?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_blink",
      "teaserUrl": "https://youtube.com/shorts/mock_blink_teaser"
    },
    "ratingExperience": {
      "ageRating": "R",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 8,
        "profanity": 8,
        "substanceUse": 9
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Anora",
      "director": "Sean Baker",
      "leadActor": "Mikey Madison"
    },
    "releaseMetrics": {
      "releaseDate": "2024-10-18",
      "runtime": 139,
      "language": "English/Russian",
      "ticketPrice": 300,
      "criticalRating": 9.4,
      "genre": ["Drama", "Romance"]
    },
    "creativeTeam": {
      "producer": "Alex Coco",
      "musicDirector": "Matthew Hearon-Smith",
      "missionBrief": "A young sex worker from Brooklyn gets her chance at a Cinderella story when she marries the son of an oligarch, but the family intervenes.",
      "aiSummarize": "A vibrant, chaotic, and emotionally raw exploration of class and impulsive love."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1505373633562-2289719d45de?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_anora",
      "teaserUrl": "https://youtube.com/shorts/mock_anora_teaser"
    },
    "ratingExperience": {
      "ageRating": "A",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 2,
        "profanity": 9,
        "substanceUse": 5
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "The Conjuring: Last Rites",
      "director": "Michael Chaves",
      "leadActor": "Patrick Wilson"
    },
    "releaseMetrics": {
      "releaseDate": "2025-09-05",
      "runtime": 118,
      "language": "English",
      "ticketPrice": 450,
      "criticalRating": 7.2,
      "genre": ["Horror", "Thriller"]
    },
    "creativeTeam": {
      "producer": "James Wan",
      "musicDirector": "Joseph Bishara",
      "missionBrief": "The Warrens return for one final case involving a supernatural entity that threatens to consume their very souls.",
      "aiSummarize": "The concluding chapter of the Warrens' journey into the occult, filled with jump scares and atmospheric dread."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1505635330303-3195307bc6e1?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_conjuring",
      "teaserUrl": "https://youtube.com/shorts/mock_conjuring_teaser"
    },
    "ratingExperience": {
      "ageRating": "A",
      "experienceFormat": "4DX Motion",
      "intensity": {
        "violence": 5,
        "profanity": 2,
        "substanceUse": 0
      },
      "arVrSupport": true
    }
  },
  {
    "productionDetails": {
      "movieTitle": "One of Them Days",
      "director": "Lawrence Lamont",
      "leadActor": "Keke Palmer"
    },
    "releaseMetrics": {
      "releaseDate": "2025-01-24",
      "runtime": 95,
      "language": "English",
      "ticketPrice": 250,
      "criticalRating": 8.0,
      "genre": ["Comedy"]
    },
    "creativeTeam": {
      "producer": "Issa Rae",
      "musicDirector": "SZA",
      "missionBrief": "Best friends and roommates Dreux and Alyssa face a series of increasingly absurd challenges over the course of a single day in LA.",
      "aiSummarize": "A high-energy buddy comedy centered on friendship and the chaotic energy of city life."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1585647347384-2593bcac5503?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_comedy",
      "teaserUrl": "https://youtube.com/shorts/mock_comedy_teaser"
    },
    "ratingExperience": {
      "ageRating": "UA",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 1,
        "profanity": 6,
        "substanceUse": 3
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Eternity",
      "director": "David Michôd",
      "leadActor": "Elizabeth Olsen"
    },
    "releaseMetrics": {
      "releaseDate": "2025-05-16",
      "runtime": 122,
      "language": "English",
      "ticketPrice": 400,
      "criticalRating": 8.5,
      "genre": ["Romance", "Sci-Fi"]
    },
    "creativeTeam": {
      "producer": "A24",
      "musicDirector": "Nicholas Britell",
      "missionBrief": "In a world where everyone must decide who they will spend eternity with, a woman struggles with the weight of her choice.",
      "aiSummarize": "A high-concept romantic drama that blends speculative fiction with deep emotional resonance."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1464802686167-b939a67e06a1?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_eternity",
      "teaserUrl": "https://youtube.com/shorts/mock_eternity_teaser"
    },
    "ratingExperience": {
      "ageRating": "U",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 0,
        "profanity": 2,
        "substanceUse": 1
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "Sisu: Road to Revenge",
      "director": "Jalmari Helander",
      "leadActor": "Jorma Tommila"
    },
    "releaseMetrics": {
      "releaseDate": "2025-06-20",
      "runtime": 98,
      "language": "Finnish/English",
      "ticketPrice": 350,
      "criticalRating": 8.3,
      "genre": ["Action", "Thriller"]
    },
    "creativeTeam": {
      "producer": "Petri Jokiranta",
      "musicDirector": "Juri Seppä",
      "missionBrief": "The legendary gold miner-turned-warrior is back, forced to hunt down a new group of plunderers in the harsh Finnish wilderness.",
      "aiSummarize": "A brutal, stylish, and wordless action spectacle of survival and grit."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1512113569143-14619baa7340?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_sisu",
      "teaserUrl": "https://youtube.com/shorts/mock_sisu_teaser"
    },
    "ratingExperience": {
      "ageRating": "A",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 10,
        "profanity": 4,
        "substanceUse": 0
      },
      "arVrSupport": false
    }
  },
  {
    "productionDetails": {
      "movieTitle": "A Nice Indian Boy",
      "director": "Roshan Sethi",
      "leadActor": "Karan Soni"
    },
    "releaseMetrics": {
      "releaseDate": "2024-03-12",
      "runtime": 105,
      "language": "English/Hindi",
      "ticketPrice": 280,
      "criticalRating": 7.9,
      "genre": ["Romance", "Comedy"]
    },
    "creativeTeam": {
      "producer": "Jonathan Wang",
      "musicDirector": "Sid Sriram",
      "missionBrief": "Naveen brings his non-Indian fiancé home to meet his traditional parents, leading to a clash of cultures and heartwarming revelations.",
      "aiSummarize": "A lighthearted and touching LGBTQ+ romantic comedy about family acceptance."
    },
    "galleryAssets": {
      "primaryPoster": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
      "backdropUrl": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop",
      "trailerUrl": "https://youtube.com/watch?v=mock_indianboy",
      "teaserUrl": "https://youtube.com/shorts/mock_indianboy_teaser"
    },
    "ratingExperience": {
      "ageRating": "UA",
      "experienceFormat": "Standard 2D",
      "intensity": {
        "violence": 0,
        "profanity": 3,
        "substanceUse": 2
      },
      "arVrSupport": false
    }
  }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB: ' + process.env.MONGODB_URI);

        // Find the first user to associate with
        const user = await User.findOne({});
        if (!user) {
            console.error('No user found to associate movies with.');
            process.exit(1);
        }

        const movies = seedData.map(item => ({
            title: item.productionDetails.movieTitle,
            director: item.productionDetails.director,
            leadActor: item.productionDetails.leadActor,
            description: item.creativeTeam.missionBrief,
            genre: item.releaseMetrics.genre.join(', '),
            rating: item.releaseMetrics.criticalRating,
            ticketPrice: item.releaseMetrics.ticketPrice,
            posterUrl: item.galleryAssets.primaryPoster,
            releaseDate: new Date(item.releaseMetrics.releaseDate),
            runtime: item.releaseMetrics.runtime,
            language: item.releaseMetrics.language,
            producer: item.creativeTeam.producer,
            musicDirector: item.creativeTeam.musicDirector,
            trailerUrl: item.galleryAssets.trailerUrl,
            teaserUrl: item.galleryAssets.teaserUrl,
            backdropUrl: item.galleryAssets.backdropUrl,
            ageRating: item.ratingExperience.ageRating,
            format: item.ratingExperience.experienceFormat.includes('IMAX') ? 'IMAX' : 
                    item.ratingExperience.experienceFormat.includes('4DX') ? '4DX' :
                    item.ratingExperience.experienceFormat.includes('3D') ? '3D' : '2D',
            intensity: {
                violence: item.ratingExperience.intensity.violence,
                profanity: item.ratingExperience.intensity.profanity,
                drugUse: item.ratingExperience.intensity.substanceUse
            },
            arvrSupport: item.ratingExperience.arVrSupport,
            addedBy: user._id
        }));

        await Movie.insertMany(movies);
        console.log('Seeded ' + movies.length + ' movies successfully for user: ' + user.username);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
