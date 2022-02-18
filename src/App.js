import React from "react";
import { Input, Fab, Box, Alert } from "@mui/material";
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
      todos: saveTodos !== null ? saveTodos : [],
      alertMessage: {
        isShown: false,
        type: null,
        text: ""
      }
    }
    this.todoInput = React.createRef();
  }

  addTodo = (e) => {
    //Check if value is empty
    let txtValue = this.todoInput.current.value;
    let hasNotAnyChar = !Array.from(txtValue).some(ch => ch !== " ");
    if(txtValue === "" && hasNotAnyChar) {
      // If value is empty show an error.
      this.showMessage("error", "Error! ToDo can not be empty.");
      return;
    };

    // Check if there todo already exists
    let isExisting = this.state.todos.find(todo => todo.title.toLowerCase() === txtValue.toLowerCase());
    if(isExisting) {
      // if ToDo exists show an error
      this.showMessage("warning", `${txtValue} already exists.`);
      return;
    }
    let newTodo = {title: this.todoInput.current.value, status: true}
    localStorage.setItem("todos", JSON.stringify([...this.state.todos]));
    this.setState({
      todos: [...this.state.todos, newTodo ],
    });
    this.todoInput.current.value = "";
    this.showMessage("success", `${txtValue} is saved.`);
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

  showMessage = (type, text) => {
    this.setState({
      alertMessage: {
        isShown: true,
        type: type,
        text: text
      }
    })
    // hide alert after 5 sec
    setTimeout(() => {
      this.setState({
        alertMessage: {isShown: false}
      })
    }, 4000);
  }

  render() {
    const { todos, alertMessage } = this.state;
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
          {alertMessage.isShown ? <Alert variant="filled" severity={alertMessage.type}>{alertMessage.text}</Alert> : <></>}
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
