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
    
  }

  componentDidMount() {
    this.loadData();
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
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    return (
      <React.Fragment>
        {this.state.items.slice(indexOfFirstPost, indexOfLastPost).sort((a, b) => b.id - a.id).map((item, i) => {
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
    const paginate = (pagenumber) => this.setState({currentPage: pagenumber})

    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(this.state.items.length / this.state.postsPerPage); i++) {
      pageNumbers.push(i)
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
              <th scope="col">#</th>
              <th scope="col">Başlık</th>
              <th scope="col">Durum</th>
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