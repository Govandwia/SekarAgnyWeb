import inTheMiddleCover from '../assets/InTheMiddle.webp';
import noRegretsCover from '../assets/NoRegrets.webp';
import keepTalkingCover from '../assets/KeepTalking.webp';
import sadLoveCover from '../assets/SadLove.webp';
import strangerDangerCover from '../assets/StrangerDanger.webp';
import treeHouseCover from '../assets/TreeHouseOfHideout.webp';

import inTheMiddleAudio from '../assets/Song/Sekar - In The Middle (Official lyric video) - Bluesummer Music.mp3';
import noRegretsAudio from '../assets/Song/Sekar Agny - No Regrets (Lyric Video) - Sekar Agny.mp3';
import keepTalkingAudio from '../assets/Song/Sekar - Keep Talking (Official Music Video) - Sekar.mp3';
import sadLoveAudio from '../assets/Song/Sekar - Sad love (Official Audio) - Bluesummer Music.mp3';
import strangerDangerAudio from '../assets/Song/Sekar Agny - Stranger Danger (Lyric Video) - Sekar Agny.mp3';
import treeHouseAudio from '../assets/Song/Sekar - Treehouse of Hideout (Official Music Video) - Bluesummer Music.mp3';

export const songs = [
  {
    id: 'in-the-middle',
    title: 'IN THE MIDDLE',
    year: '2025',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Solo Acoustic',
    genre: 'Indie Pop / Folk',
    language: 'English',
    duration: '3:24',
    cover: inTheMiddleCover,
    audioUrl: inTheMiddleAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'CAUGHT', align: 'left', line: 1 },
      { text: 'RIGHT IN', align: 'right', line: 2 },
      { text: 'THE MIDDLE OF US', align: 'center', line: 3 },
    ],
    story:
      'Written in the silence of late autumn, In The Middle captures that suspended threshold where letting go and holding on meet. A delicate tapestry of acoustic textures, intimate vocal layering, and poetic ambiguity.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
      {
        source: 'CONSECTETUR',
        stars: '★★★★',
        quote: '“CONSECTETUR ADIPISCING ELIT”',
      },
    ],
  },
  {
    id: 'no-regrets',
    title: 'NO REGRETS',
    year: '2025',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Solo Single',
    genre: 'Alt-Pop / Melodic',
    language: 'English',
    duration: '3:48',
    cover: noRegretsCover,
    audioUrl: noRegretsAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'I LEFT', align: 'right', line: 1 },
      { text: 'THE GHOSTS', align: 'left', line: 2 },
      { text: 'BEHIND THE DOOR', align: 'right', line: 3 },
    ],
    story:
      'A defiant ode to closure and self-preservation. Driven by pulse-racing drums and soaring vocal dynamics, No Regrets celebrates the bitter sweetness of moving forward without turning back.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
      {
        source: 'DOLOR SIT AMET',
        stars: '★★★★★',
        quote: '“SED DO EIUSMOD TEMPOR INCIDIDUNT”',
      },
    ],
  },
  {
    id: 'keep-talking',
    title: 'KEEP TALKING',
    year: '2025',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Sekar Agny',
    genre: 'Dream Pop / Indie',
    language: 'English',
    duration: '2:56',
    cover: keepTalkingCover,
    audioUrl: keepTalkingAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'WORDS FLOAT', align: 'left', line: 1 },
      { text: 'LIKE SMOKE', align: 'right', line: 2 },
      { text: 'IN THE EMPTY ROOM', align: 'center', line: 3 },
    ],
    story:
      'Floating on shimmering chorus pedals and hazy reverbs, Keep Talking examines the disconnect in conversation when both people are already worlds apart.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★',
        quote: '“DUIS AUTE IRURE DOLOR IN REPREHENDERIT”',
      },
      {
        source: 'ADIPISCING ELIT',
        stars: '★★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
    ],
  },
  {
    id: 'sad-love',
    title: 'SAD LOVE',
    year: '2024',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Solo Ballad',
    genre: 'Chamber Pop / Ballad',
    language: 'Indonesian / English',
    duration: '3:35',
    cover: sadLoveCover,
    audioUrl: sadLoveAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'HANYA', align: 'right', line: 1 },
      { text: 'BAYANGAN YANG', align: 'left', line: 2 },
      { text: 'ENGGAN MEMUDAR', align: 'right', line: 3 },
    ],
    story:
      'Stripped back to delicate piano chords and haunting strings, Sad Love delves deep into the quiet ache of unsaid goodbyes. The arrangement allows Sekar’s vocal nuances to take center stage.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★★',
        quote: '“EXCEPTEUR SINT OCCAECAT CUPIDATAT”',
      },
      {
        source: 'CONSECTETUR',
        stars: '★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
    ],
  },
  {
    id: 'stranger-danger',
    title: 'STRANGER DANGER',
    year: '2024',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Solo Single',
    genre: 'Atmospheric Indie',
    language: 'English',
    duration: '3:15',
    cover: strangerDangerCover,
    audioUrl: strangerDangerAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'SHADOWS FALL', align: 'left', line: 1 },
      { text: 'UNDER CANADIAN PINES', align: 'right', line: 2 },
      { text: 'WHO ARE YOU NOW', align: 'center', line: 3 },
    ],
    story:
      'Inspired by solitary autumn walks through the Canadian woods. Stranger Danger fuses cinematic percussion with eerie vocal harmonies that echo like wind through amber foliage.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
      {
        source: 'DOLOR SIT AMET',
        stars: '★★★★',
        quote: '“VELIT ESSE CILLUM DOLORE EU FUGIAT”',
      },
    ],
  },
  {
    id: 'tree-house-of-hideout',
    title: 'TREE HOUSE OF HIDEOUT',
    year: '2024',
    writtenBy: 'Sekar Agny',
    performedBy: 'Sekar Agny',
    featuring: 'Acoustic Suite',
    genre: 'Folk / Nostalgia',
    language: 'English',
    duration: '4:10',
    cover: treeHouseCover,
    audioUrl: treeHouseAudio,
    spotifyUrl: 'https://open.spotify.com/',
    appleMusicUrl: 'https://music.apple.com/',
    lyricsZigZag: [
      { text: 'WOODEN BOARDS', align: 'right', line: 1 },
      { text: 'AND SECRET PROMISES', align: 'left', line: 2 },
      { text: 'KEPT FOREVER', align: 'center', line: 3 },
    ],
    story:
      'A warm, nostalgic journey back to childhood sanctuaries. Warm tape-saturated acoustic guitars, warm upright bass, and nostalgic lo-fi warmth create a sanctuary for the listener.',
    quotes: [
      {
        source: 'LOREM IPSUM',
        stars: '★★★★★',
        quote: '“SUNT IN CULPA QUI OFFICIA DESERUNT”',
      },
      {
        source: 'CONSECTETUR',
        stars: '★★★★',
        quote: '“LOREM IPSUM DOLOR SIT AMET”',
      },
    ],
  },
];
