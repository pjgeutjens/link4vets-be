import { useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import gtm from '../../lib/gtm';

const Redirect: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    navigate(-2);
  }, []);

  return (
    <>
      <Typography
        color="textPrimary"
        variant="overline"
      >
        redirecting
      </Typography>
    </>
  );
};

export default Redirect;
