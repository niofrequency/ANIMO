export interface CreatureStats {
  aggression: number;
  camouflage: number;
  speed: number;
  defense: number;
}

export interface YouTubeVideo {
  title: string;
  thumbnail: string;
  url: string;
}

export interface CreatureInfo {
  commonName: string;
  scientificName: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  stats: CreatureStats;
  videos: YouTubeVideo[];
}

export interface CollectionItem {
  id: string;
  creature: CreatureInfo;
  capturedAt: string;
  imageUrl: string;
}
