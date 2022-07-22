import React from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"
import "./style.css"

export class DataGridClsComponent extends React.Component {

  state = {
    loading: false,
    items: [],
    todo: null,
    // variables definitions for pagination
    currentPage: 1,
    postsPerPage: 25,
    // variables definitions for reverse buttons
    reverseListId: false,
    reverseListTitle: false,
    // variables definitions for filter button
    todoList: "0",
    filteredTodos: [],
  }

  //function that sorts objects in array by propname
  propComparator = (propName) => {
    return (a, b) => a[propName] === b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
  }

  componentDidMount() {
    this.loadData();
  }

  //to filter the list by filter button status
  componentDidUpdate(prevProbs, prevState) {
    if((prevState.todoList !== this.state.todoList) || (prevState.items !== this.state.items)){
      switch(this.state.todoList){
        case '1':
          this.setState({filteredTodos: this.state.items.filter(item => item.completed === true)});
          break;
        case '2':
          this.setState({filteredTodos: this.state.items.filter(item => item.completed === false)});
          break;
        default:
          this.setState({filteredTodos: this.state.items});
          break;
      }
    }
  }
    

  loadData = () => {
    this.setState({ loading: true })
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        this.setState({ items: response, loading: false })
    }).catch(e => {
      this.setState({ loading: false })
    })
  }
  
  renderBody = () => {
    // variables definitions for pagination
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    // what to do when the reverse buttons are clicked
    this.state.filteredTodos.sort(this.propComparator("id")).reverse();
    if (this.state.reverseListId === true) {
      this.state.filteredTodos.sort(this.propComparator("id"));
    }
    if (this.state.reverseListTitle === true) {
      this.state.filteredTodos.sort(this.propComparator("title"));
    }
    return (
      <React.Fragment>
        {this.state.filteredTodos.slice(indexOfFirstPost, indexOfLastPost).map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => this.onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => this.onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }

  Pegination = () => {
    // when we select different page this function changes data shown
    const paginate = (pagenumber) => this.setState({currentPage: pagenumber});

    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(this.state.filteredTodos.length / this.state.postsPerPage); i++) {
      pageNumbers.push(i);
    }
    
    return(
      <React.Fragment>
       <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {pageNumbers.map(number => (
              <li key={number} className="page-item">
                <a href="!#" onClick={() => paginate(number)} className="page-link">
                  {number}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </React.Fragment>
    )
  }

  renderTable = () => {
    return (
      <>
        <div className="d-flex">
        <Button onClick={this.onAdd}>Ekle</Button>
        {/* option button for different pagination */}
        <select  onChange={(e) => this.setState({postsPerPage:(e.target.value)})}
        className="form-select form-select-md pegination-button"  
        aria-label=".form-select-md example">
          <option value={this.state.postsPerPage}>Sayfala</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
        </select>
      </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#
              {/* reverse button */}
              <span><button className="reverse-button" onClick={() =>this.setState({reverseListId: !this.state.reverseListId})}> ❯ </button></span>
              </th>
              <th scope="col">Başlık
              {/* reverse button */}
              <span><button className="reverse-button" onClick={() => this.setState({reverseListTitle: !this.state.reverseListTitle})}> ❯ </button></span>
              </th>
              <th scope="col">Durum
              {/* filter button */}
                <span>
                  <select className="custom-select my-1 mr-sm-2 todos-button" 
                  onChange={(e) => this.setState({todoList:(e.target.value)})}>
                    <option value="0">Hepsi</option>
                    <option value="1">Tamamlandı</option>
                    <option value="2">Yapılacak</option>
                  </select>
                </span>
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        {/* rendering pagination component */}
        {this.Pegination()}
    </>
    )
  }

  saveChanges = () => {
    // insert
    const { todo, items } = this.state
    if (todo && todo.id === -1) {

      todo.id = Math.max(...items.map(x => x.id)) + 1
      items.push(todo)
      this.setState({ items, todo: null })
      alert("Ekleme işlemi başarıyla gerçekleşti.")
      return
    }
    // update
    const index = items.findIndex(item => item.id === todo.id)
    items[index] = todo
    
    this.setState({ items, todo: null})
  }

  onAdd = () => {
    this.setState({
      todo: {
        id: -1,
        title: "",
        completed: false
      }
    })
  }

  onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const { items } = this.state
    const index = items.findIndex(item => item.id === id)
    items.splice(index, 1)
    this.setState({ items })
  }

  onEdit = (todo) => {
    this.setState({ todo })
  }

  onTitleChange = (value) => {
    const todo = this.state.todo
    todo.title = value
    this.setState({ todo })
  }

   onCompletedChange = (value) => {
    const todo = this.state.todo
    todo.completed = value
    this.setState({ todo })
  }

  renderEditForm = () => {
    const { todo } = this.state
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => this.onTitleChange(e.target.value)}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => this.onCompletedChange(e.target.checked)}
        />
        <Button onClick={this.saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={this.cancel}>Vazgeç</Button>
      </>
    )
  }

  cancel = () => {
    this.setState({ todo: null })
  }

  render() {
    const { todo, loading } = this.state
    return (
      <>
      { loading ? "Yükleniyor...." : (todo ? this.renderEditForm() : this.renderTable())}
      </>
    )
  }
}