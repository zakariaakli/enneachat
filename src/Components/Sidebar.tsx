import React from "react";
import { List, ListItem, Typography, Grid } from "@mui/material";
//import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <Grid container className="sidebar-container">
      <Typography variant="h6">Articles & Theorie</Typography>
      <List>
        <ListItem>Article 1</ListItem>
        <ListItem>Article 2</ListItem>
        <ListItem>Article 3</ListItem>
      </List>
    </Grid>
  );
};

export default Sidebar;
