import { ImageGallery } from '@/components/gallery';
import styles from './App.module.scss';

const TEST_IMAGES = [
  'https://i.pinimg.com/736x/22/0a/81/220a8170609409aa01d6853508a9025c.jpg',
  'https://i.pinimg.com/736x/42/34/ee/4234ee553eec8f4c5408985ec5f83557.jpg',
  'https://i.pinimg.com/736x/27/81/e6/2781e607775f355ab25932d96851687b.jpg',
  'https://i.pinimg.com/736x/af/c8/88/afc888d054a9e6b691ca39cb5194f38a.jpg',
    'https://i.pinimg.com/736x/22/0a/81/220a8170609409aa01d6853508a9025c.jpg',
  'https://i.pinimg.com/736x/42/34/ee/4234ee553eec8f4c5408985ec5f83557.jpg',
  'https://i.pinimg.com/736x/27/81/e6/2781e607775f355ab25932d96851687b.jpg',
  'https://i.pinimg.com/736x/af/c8/88/afc888d054a9e6b691ca39cb5194f38a.jpg',
];

function App() {
  return (
    <div className={styles.container}>
      <ImageGallery
        images={TEST_IMAGES}
        productName="Alpine Ascent Pack"
      />
    </div>
  );
}

export default App;