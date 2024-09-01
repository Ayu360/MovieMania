import { render } from '@testing-library/react-native';

import RootIndex, { AppName } from '@/app/index';

describe('<RootIndex />', () => {
  test('Text renders correctly on RootIndex', () => {
    const { getByText } = render(<RootIndex />);

    getByText("MovieMania");
  });
  test('CustomText renders correctly', () => {
    const tree = render(<AppName>Some text</AppName>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
