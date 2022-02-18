import React, { Component } from "react";
import {Grid, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const styles = {
  Icon: {
    marginLeft: "auto",
  },
  Paper: {
    margin: "auto",
    padding: 10,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    width: 500,
  },
};

export default class ToDo extends Component {
  constructor() {
    super();
  }
  render() {
    let { item, dragNdrop } = this.props;

    let { title, status } = item;
    return (
      <Grid
        container
        ref={dragNdrop.innerRef}
        {...dragNdrop.draggableProps}
        {...dragNdrop.dragHandleProps}
      >
        <Paper style={styles.Paper}>
          <span style={styles.Todo}>
            {this.props.index + 1}. {title}
          </span>
          <CheckBoxIcon style={styles.Icon} />
          <DeleteIcon
            color="primary"
            onClick={() => this.props.deleteTodo(title)}
          />
        </Paper>
      </Grid>
    );
  }
}
