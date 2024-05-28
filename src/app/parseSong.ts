export interface Lyric {
    name: string;
    author: string;
    lyrics: {
      timestamp: number;
      lyric: string;
    }[];
  }
export default function parseSong(name : string, author: string, lyric: string): Lyric {
    const lines = lyric.split('\n');

    const result = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSplit = line.split(/(\[|\])/g);
        const text = lineSplit[4];
        const textTime = lineSplit[2];
        const arrayTime = textTime.split(/(\:|\.)/g);
        const minutes = parseInt(arrayTime[0]);
        const seconds = parseInt(arrayTime[2]);
        const milliseconds = parseInt(arrayTime[4] || '0');
        let parsedTime = minutes * 60 * 1000 + seconds * 1000 + milliseconds;


        result.push({ timestamp: parsedTime, lyric:text });
    }
    return {name, author, lyrics: result};
}