import React from "react";
import { Input, Fab, Box } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import "@fontsource/roboto/300.css";
import "./App.css";
import ToDo from "./components/ToDo";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Reorder } from "@material-ui/icons";

class App extends React.Component {
  constructor() {
    super();
    const saveTodos = JSON.parse(localStorage.getItem("todos"));
    this.state = {
      todos: saveTodos !== null ? saveTodos : []
    }
    this.todoInput = React.createRef();
  }

  addTodo = (e) => {
    e.preventDefault();
    let newTodo = {title: this.todoInput.current.value, status: true}
    localStorage.setItem("todos", JSON.stringify([...this.state.todos]));
    this.setState({
      todos: [...this.state.todos, newTodo ],
    });
    this.todoInput.current.value = "";
  };

  deleteTodo = (title) => {
    let clone = [...this.state.todos.filter(todo => todo.title !== title)];
    this.setState({ todos: clone });

    localStorage.setItem("todos", JSON.stringify(clone));
  };

  onDragEnd = (result) => {
    let fromIndex = result.source.index;
    if(result.destination) {
      let toIndex = result.destination.index;
      const newTodos = [...this.state.todos];
      const [reOrdered] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, reOrdered);
      this.setState({todos: newTodos});
    }
  }

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
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="todoList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {todos.map((todo, index) => {
                    return (
                      <Draggable key={todo.title} draggableId={todo.title} index={index}>
                        {(provided) => (
                          <ToDo
                            dragNdrop={provided}
                            item={todo}
                            deleteTodo={this.deleteTodo}
                            key={index}
                            index={index}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </div>
    );
  }
}

export default App;
