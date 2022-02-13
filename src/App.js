import React from "react";
import { Input, Fab, Box, Typography, Grid } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "@fontsource/roboto/300.css";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      task: "",
      todo: [],
    };
  }

  addTask = (e) => {
    this.setState({ task: e.target.value });
  };

  addTodo = (e) => {
    e.preventDefault();
    this.setState({ todo: [this.state.task, ...this.state.todo] });
  };

  render() {
    const { task, todo } = this.state;
    return (
      <div className="App">
        <Box
          sx={{
            width: 800,
            height: 800,
            backgroundColor: "primary.light",
          }}
        >
          <Input
            type="text"
            placeholder="Add new ..."
            value={task}
            onChange={this.addTask}
          />
          <Fab color="secondary" aria-label="add" onClick={this.addTodo}>
            <AddIcon />
          </Fab>

          {todo.map((item) => {
            return (
              <div>
                <Grid container sx={{ color: "text.primary"}}>
                  <Grid item xs={5}>
                    <Typography variant="h6">
                      {item}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <DeleteIcon />
                  </Grid>
                </Grid>
              </div>
            );
          })}
        </Box>
      </div>
    );
  }
}

export default App;
