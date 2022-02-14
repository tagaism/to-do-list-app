import React, { Component } from "react";
import { Typography, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default class ToDo extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Grid container sx={{ color: "text.primary" }}>
          <Grid item xs={5}>
            <Typography variant="h6">{this.props.item}</Typography>
          </Grid>
          <Grid item xs={7}>
            <DeleteIcon />
          </Grid>
        </Grid>
      </div>
    );
  }
}
