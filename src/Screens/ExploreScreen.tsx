import { Explore } from '@pages';
import React from 'react';
import { CityContextProvider } from '@common/provider';

const ExploreScreen: React.FC = () => {
  return (
    <CityContextProvider initialValue={0}>
      <Explore />
    </CityContextProvider>
  );
};

export default ExploreScreen;
