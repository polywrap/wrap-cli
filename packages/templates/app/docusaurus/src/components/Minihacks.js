import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, Container, Grid, Link, Typography, useTheme } from "@mui/material";
import MinihackIcon from "../../static/img/minihacks.png"
import useThemeContext from '@theme/hooks/useThemeContext';

const useStyles = makeStyles((theme) => ({
  link: {
    color: `${theme.palette.primary.dark} !important`,
    fontWeight: 800,
  },
}));

export default function Minihacks() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const {isDarkTheme} = useThemeContext();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          background: `rgba(0,0,0,${isDarkTheme ? 0.08 : 0.02})`,
          border: `1px solid ${isDarkTheme ? theme.palette.primary.main : "#228eb9"}30`,
          borderRadius: theme.spacing(4),
          display: "block",
          overflow: "hidden",
          padding: theme.spacing(4),
          transform: "translateY(0)",
          transition: "all 0.25s ease-in-out",
          backdropFilter: "blur(16px)",
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3} md={2}>
            <Box 
              sx={{
                [theme.breakpoints.down("sm")]: {
                  p: theme.spacing(5),
                  pb: 0,
                },
              }}
            >
              <img src={MinihackIcon}/>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <Typography variant="h4" component="h3" fontWeight="800">
              Polywrap Minihack Submissions are Open!
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" color={"var(--ifm-heading-color)"}>
                Minihacks are quarterly events through which the Polywrap DAO distributes tokens for retroactive contributions. Any person who publishes a contribution through a github issue will be eligible to earn a fraction of the WRAP tokens that have been allocated for each period.
              </Typography>
            </Box>
            <Box mt={1}>
              <Link href="https://github.com/polywrap/mini-hacks" target="_blank" rel="noredirect" underline="hover" className={classes.link}>
                Join now &#8250;
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 