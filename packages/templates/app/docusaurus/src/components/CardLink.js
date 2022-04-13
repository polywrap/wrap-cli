import React from "react";
import Link from "@docusaurus/Link";
import { makeStyles } from "@mui/styles";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import useThemeContext from '@theme/hooks/useThemeContext';

const useStyles = makeStyles(() => ({
  root: {
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

export default function CardLink(props) {
  const {children, link, shine} = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const {isDarkTheme} = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true
  });

  return (
    <Link href={link} className={classes.root}>
      <Box
        sx={{
          background: "rgba(255,255,255,0.05)",
          border: `1px solid rgba(${isDarkTheme ? "255,255,255" : "0,0,0"},0.1)`,
          borderRadius: theme.spacing(4),
          boxShadow: "0 8px 16px rgba(0,0,0,0.02), 0 16px 32px rgba(0,0,0,0.1)",
          display: "block",
          overflow: "hidden",
          padding: theme.spacing(4),
          transform: "translateY(0)",
          transition: "all 0.25s ease-in-out",
          backdropFilter: "blur(16px)",
          "[data-theme=light] &": {
            border: "1px solid rgba(0,0,0,0.1)",
          },
          "&:hover": {
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.05), 0 16px 64px rgba(0,0,0,0.2)",
            transform: "translateY(-1%)",
            "& .card-shine": {
              transition: "transform 0.5s ease-in-out",
              transform: "rotate(-49deg) translate(0,-40%)",
            },
            "& .card-link": {
              textDecoration: "underline",
            },
          },
        }}
      >
        {shine && !isMobile &&
          <Box
            className="card-shine"
            sx={{
              position: "absolute",
              background: "white",
              opacity: 0.03,
              width: "200%",
              height: "200%",
              transform: "rotate(-49deg) translate(0,75%)",
              transformOrigin: "30% center",
              transition: "transform 0",
              '@media not all and (min-resolution:.001dpcm)': {
                display: 'none',
              },
            }}
          />
        }
        {children}
      </Box>
    </Link>
  );
} 