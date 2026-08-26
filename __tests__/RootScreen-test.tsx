import { render } from '@testing-library/react-native';

import RootIndex from '@/app/index';

describe('<RootIndex />', () => {
  test('renders the MovieMania eyebrow', () => {
    const { getByText } = render(<RootIndex />);
    getByText('MovieMania');
  });
});
