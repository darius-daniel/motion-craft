import './App.css';
import SlideIn from './components/SlideIn/SlideIn';

export default function App() {
  return (
    <SlideIn
      duration={1000}
      distance={200}
      slideDirection="fromTop"
      fade={true}
    >
      <h1>Sliding into the Screen</h1>
    </SlideIn>
  );
}
