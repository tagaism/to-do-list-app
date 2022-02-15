import React from "react";
import { Input, Fab, Box } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import "@fontsource/roboto/300.css";
import "./App.css";
import ToDo from "./components/ToDo";

class App extends React.Component {
  constructor() {
    super();
    const saveTodos = JSON.parse(localStorage.getItem("todos"));
    if (saveTodos !== null) {
      this.state = {
        todos: saveTodos,
      };
    } else {
      this.state = {
        todos: [],
      };
    }
    this.todoInput = React.createRef();
  }

  addTodo = (e) => {
    e.preventDefault();
    localStorage.setItem("todos", JSON.stringify([...this.state.todos]));
    this.setState({
      todos: [...this.state.todos, this.todoInput.current.value],
    });
    this.todoInput.current.value = "";
  };

  deleteTodo = (index) => {
    let clone = [...this.state.todos];
    clone.splice(index, 1);
    this.setState({ todos: clone });

    localStorage.setItem("todos", JSON.stringify(clone));
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
          {todos.map((item, index) => {
            return (
              <ToDo
                item={item}
                deleteTodo={this.deleteTodo}
                key={index}
                index={index}
              />
            );
          })}
        </Box>
      </div>
    );
  }
}

export default App;
