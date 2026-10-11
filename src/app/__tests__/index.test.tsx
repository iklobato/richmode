import { render, screen } from '@testing-library/react-native';

import HomeScreen from '../index';

test('home screen renders the app name', async () => {
  await render(<HomeScreen />);
  expect(screen.getByText('RichMode')).toBeOnTheScreen();
});
