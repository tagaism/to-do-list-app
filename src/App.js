import React from "react";
import { Input, Fab, Box } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import "@fontsource/roboto/300.css";
import "./App.css";
import ToDo from "./components/ToDo";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
    };
    this.todoInput = React.createRef();
  }

  addTodo = (e) => {
    e.preventDefault();
    this.setState({
      todos: [this.todoInput.current.value, ...this.state.todos],
    });
    this.todoInput.current.value = "";
  };

  render() {
    const { todos } = this.state;
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
            inputRef={this.todoInput}
          />
          <Fab color="secondary" aria-label="add" onClick={this.addTodo}>
            <AddIcon />
          </Fab>
          {todos.map((item) => {
            return <ToDo item={item} />;
          })}
        </Box>
      </div>
    );
  }
}

export default App;
