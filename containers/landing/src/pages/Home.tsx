import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  HomeHero,
} from '../components/home';
import gtm from '../lib/gtm';

const Home: FC = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Link4Vets LANDING</title>
      </Helmet>
      <div>
        <HomeHero />
      </div>
    </>
  );
};

export default Home;
