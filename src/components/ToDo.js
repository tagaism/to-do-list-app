import React, { Component } from "react";
import {Grid, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";

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
  PaperCompleted: {
    margin: "auto",
    padding: 10,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    width: 500,
    textDecorationLine: "line-through",
    backgroundColor: "lightgrey"
  }
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
        <Paper style={status ? styles.Paper : styles.PaperCompleted }>
          {this.props.index + 1}. {title}
          <Checkbox
            style={styles.Icon}
            onChange = {() => this.props.complete(title)}
            checked = {!status}
          />
          <DeleteIcon
            color="primary"
            onClick = {() => this.props.deleteTodo(title)}
          />
        </Paper>
      </Grid>
    );
  }
}
