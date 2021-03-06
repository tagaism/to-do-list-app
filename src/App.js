import React from "react";
import { Input, Button, Grid, Paper, Alert, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import "@fontsource/roboto/300.css";
import "./App.css";
import ToDo from "./components/ToDo";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const styles = {
  Paper: {
    padding: 20,
    margin: "auto",
    textAlign: "center",
    width: 500,
  },
  Grid: {
    marginTop: 20,
    justifyContent: "center"
  }
};

class App extends React.Component {
  constructor() {
    super();
    const saveTodos = JSON.parse(localStorage.getItem("todos"));
    this.state = {
      todos: saveTodos !== null ? saveTodos : [],
      message: {
        isShown: false,
        type: null,
        text: ""
      },
      activeFilter: "all"
    };
    this.todoInput = React.createRef();
  }

  addTodo = (e) => {
    e.preventDefault();
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
      todos: [...this.state.todos, newTodo],
    });
    this.todoInput.current.value = "";
    this.showMessage("success", `${txtValue} is saved.`);
  };

  deleteTodo = (title) => {
    let clone = [...this.state.todos.filter((todo) => todo.title !== title)];
    this.setState({ todos: clone });
    localStorage.setItem("todos", JSON.stringify(clone));
  };

  deleteAll = () => {
    let activeFilter = this.state.activeFilter;
    let allTodos = JSON.parse(localStorage.getItem("todos"));
    let remainedTodos = allTodos.filter(todo => {
      if(activeFilter === "completed") {
        return todo.status;
      } else if(activeFilter === "active") {
        return !todo.status;
      }
      return [];
    })
    this.setState({todos: remainedTodos});
    localStorage.setItem("todos", JSON.stringify(remainedTodos));
    this.showMessage("success", `${activeFilter} ToDos deleted.`);
  }

  complete = (title) => {
    let todosWithCompleted = this.state.todos.map(todo => {
      if (todo.title.toLowerCase() === title.toLowerCase()) {
        todo.status = !todo.status;
      }
      return todo;
    })
    this.setState({
      todos: todosWithCompleted
    })
    localStorage.setItem("todos", JSON.stringify(todosWithCompleted))
  }
  onDragEnd = (result) => {
    let fromIndex = result.source.index;
    if (result.destination) {
      let toIndex = result.destination.index;
      const newTodos = [...this.state.todos];
      const [reOrdered] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, reOrdered);
      this.setState({ todos: newTodos });
      localStorage.setItem("todos", JSON.stringify(newTodos))
    }
  };

  showMessage = (type, text) => {
    this.setState({
      message: {
        isShown: true,
        type: type,
        text: text
      }
    })
    // hide alert after 5 sec
    setTimeout(() => {
      this.setState({
        message: {isShown: false}
      })
    }, 4000);
  }

  handleFilter = (event) => {
    let val = event.target.value;
    let allTodos = JSON.parse(localStorage.getItem("todos"));
    allTodos = allTodos === null ? [] : allTodos;
    if(val === "active") {
      this.setState({
        todos: allTodos.filter(todo => todo.status),
        activeFilter: val
      });
    } else if(val === "completed") {
      this.setState({
        todos: allTodos.filter(todo => !todo.status),
        activeFilter: val
      });
    } else {
      this.setState({
        todos: allTodos,
        activeFilter: val
      })
    }
    
  }

  render() {
    const { todos, message, activeFilter } = this.state;
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Paper style={styles.Paper}>
              <form onSubmit={this.addTodo} style={{ display: "flex" }}>
                <Input
                  type="text"
                  placeholder="Add new ..."
                  inputRef={this.todoInput}
                  style={{ width: "90%" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ width: "10%" }}
                >
                  <AddIcon />
                </Button>
              </form>
            </Paper>
            <Grid container style={styles.Grid}>
              <RadioGroup
                onChange={this.handleFilter}
                row
                defaultValue="all"
                name="radio-buttons-group"
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="active" control={<Radio />} label="Active" />
                <FormControlLabel value="completed" control={<Radio />} label="Completed" />
              </RadioGroup>
            </Grid>
            <Grid container style={styles.Grid}>
              {message.isShown ? <Alert variant="filled" severity={message.type}>{message.text}</Alert> : <></>}
            </Grid>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="todoList">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {todos.map((todo, index) => {
                      return (
                        <Draggable
                          key={todo.title}
                          draggableId={todo.title}
                          index={index}
                        >
                          {(provided) => (
                            <ToDo
                              dragNdrop={provided}
                              item={todo}
                              complete={this.complete}
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
            <Grid
              style={styles.Grid}
              container
            >
              {todos.length >= 2 ?
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if(window.confirm(`Are you sure to delete ${activeFilter} ToDos?`)) {
                      const deleteAll = this.deleteAll.bind();
                      deleteAll();
                    };
                  }} size="small">
                  <DeleteForeverIcon />
                  {`Delete ${activeFilter}`}
                </Button>
                : <></>}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default App;
