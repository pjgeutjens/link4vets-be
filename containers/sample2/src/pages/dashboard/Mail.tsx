import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box } from '@material-ui/core';
import {
  MailComposer,
  MailDetails,
  MailList,
  MailSidebar
} from '../../components/dashboard/mail';
import gtm from '../../lib/gtm';
import { getLabels } from '../../slices/mail';
import { useDispatch } from '../../store';

const Mail: FC = () => {
  const dispatch = useDispatch();
  const { emailId } = useParams();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    dispatch(getLabels());
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Mail | Material Kit Pro</title>
      </Helmet>
      <Box
        ref={rootRef}
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <MailSidebar containerRef={rootRef} />
        {emailId ? <MailDetails /> : <MailList />}
        <MailComposer />
      </Box>
    </>
  );
};

export default Mail;
