import { useEffect } from 'react';
import type { FC } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  // Button,
  Container,
  // Skeleton,
  Typography
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
// import CheckCircleIcon from '../../icons/CheckCircle';

const HomeHero: FC = (props) => {
  const theme = useTheme();

  useEffect(() => {
    (
      async () => {
        // const response = await fetch(`/static/home/hero_${theme.palette.mode}.png`);
        // const blob = await response.blob();

        // setImage(URL.createObjectURL(blob));
        // setIsLoading(false);
      }
    )();
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        pt: 6
      }}
      {...props}
    >
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          px: {
            md: '130px !important'
          }
        }}
      >
        <Typography
          color="primary"
          variant="overline"
        >
          Introducing
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="h3"
        >
          Link4Vets APP
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="body1"
          sx={{ py: 3 }}
        >
          An application that is part of the Link4Vets platform
        </Typography>
      </Container>
    </Box>
  );
};

export default HomeHero;
