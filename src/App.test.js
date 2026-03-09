import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/FaceRecognition', () => () => <div>Componente de reconhecimento facial</div>);

test('renderiza o componente principal', () => {
  render(<App />);
  expect(screen.getByText(/Componente de reconhecimento facial/i)).toBeInTheDocument();
});
