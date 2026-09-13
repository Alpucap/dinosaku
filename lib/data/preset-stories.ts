import { StoryData } from '@/components/dino/DinoApp';
import generatedStories from './generated-stories.json';

export interface PresetStory extends StoryData {
  id: string;
  description: string;
  coverImage: string;
}

const DEFAULT_PRESET_STORIES: PresetStory[] = [
  {
    id: 'kebutuhan-hutan-ajaib',
    title: 'Berburu Harta Karun Hutan',
    description: 'Bantu Purba membedakan mana barang yang ia butuhkan dan mana yang hanya ia inginkan.',
    coverImage: 'https://placehold.co/400x300/EAF7ED/064E2B?text=Hutan+Ajaib',
    panels: [
      {
        text: 'Purba masuk ke dalam Hutan Ajaib. Di sana, pedagang hewan menawarkan ramuan ajaib dan topi kristal.',
        imagePrompt: '[MOCK]',
        imageUrl: 'https://placehold.co/600x600/EAF7ED/064E2B?text=Masuk+Hutan',
      },
      {
        text: 'Topi kristal sangat indah (Keinginan), tapi Purba ingat bahwa ia lebih membutuhkan bekal makanan (Kebutuhan) untuk perjalanannya.',
        imagePrompt: '[MOCK]',
        imageUrl: 'https://placehold.co/600x600/EAF7ED/064E2B?text=Memilih+Barang',
      },
      {
        text: 'Purba memutuskan untuk menabung koin emasnya dan hanya membeli bekal. Ia pun bisa melanjutkan perjalanan dengan aman.',
        imagePrompt: '[MOCK]',
        imageUrl: 'https://placehold.co/600x600/EAF7ED/064E2B?text=Melanjutkan+Perjalanan',
      },
      {
        text: 'Keputusan yang cerdas! Karena mendahulukan Kebutuhan, perjalanan Purba berhasil tanpa masalah.',
        imagePrompt: '[MOCK]',
        imageUrl: 'https://placehold.co/600x600/EAF7ED/064E2B?text=Berhasil',
      }
    ],
    quiz: [
      {
        question: 'Apa barang yang hanya berupa Keinginan bagi Purba?',
        options: ['Topi kristal', 'Bekal makanan', 'Air minum'],
        correctAnswer: 'Topi kristal',
        insight: 'Keinginan adalah barang yang kita mau tapi tidak esensial untuk bertahan hidup atau menyelesaikan tugas.'
      },
      {
        question: 'Mengapa bekal makanan disebut sebagai Kebutuhan?',
        options: ['Karena warnanya menarik', 'Karena harganya mahal', 'Karena penting untuk perjalanan'],
        correctAnswer: 'Karena penting untuk perjalanan',
        insight: 'Kebutuhan adalah sesuatu yang sangat penting dan tanpanya kita bisa kesulitan.'
      },
      {
        question: 'Apa yang Purba lakukan dengan koin emasnya?',
        options: ['Membeli topi kristal', 'Ditabung setelah membeli kebutuhan', 'Diberikan ke pedagang'],
        correctAnswer: 'Ditabung setelah membeli kebutuhan',
        insight: 'Setelah membeli kebutuhan pokok, sisa uang sebaiknya ditabung.'
      },
      {
        question: 'Apa perbedaan utama kebutuhan dan keinginan?',
        options: ['Kebutuhan itu penting, keinginan itu tambahan', 'Kebutuhan lebih mahal', 'Tidak ada bedanya'],
        correctAnswer: 'Kebutuhan itu penting, keinginan itu tambahan',
        insight: 'Selalu prioritaskan kebutuhanmu terlebih dahulu!'
      },
      {
        question: 'Apakah boleh membeli barang keinginan?',
        options: ['Tidak boleh sama sekali', 'Boleh, jika kebutuhan sudah terpenuhi', 'Selalu utamakan keinginan'],
        correctAnswer: 'Boleh, jika kebutuhan sudah terpenuhi',
        insight: 'Kamu boleh membeli keinginan jika ada sisa dana setelah semua kebutuhan utama terpenuhi.'
      }
    ]
  }
];

export const PRESET_STORIES: PresetStory[] = [...(generatedStories as PresetStory[]), ...DEFAULT_PRESET_STORIES];
