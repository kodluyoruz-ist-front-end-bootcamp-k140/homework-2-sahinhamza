import React, { useEffect, useState } from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"
import "./style.css"

export function DataGrid() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [todo, setTodo] = useState(null)

  // variables definitions for pagination
  const[currentPage, setCurrentPage] = useState(1);
  const[postsPerPage, setPostsPerPage] = useState(25);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // when we select different page this function changes data shown
  const paginate = (pagenumber) => setCurrentPage(pagenumber)


  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        setItems(response)
        setLoading(false)
    }).catch(e => {
      console.log(e)
      setLoading(false)
    })
  }

  const renderBody = () => {
    return (
      <React.Fragment>
        {/* show selected number of data inside a page */}
        {items.slice(indexOfFirstPost, indexOfLastPost).sort((a, b) => b.id - a.id).map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }
  // pegination component
  const Pegination = () => {
    const pageNumbers = [];
    
    for(let i = 1; i <= Math.ceil(items.length / postsPerPage); i++) {
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
  const renderTable = () => {
    return (
    <>
      <div className="d-flex">
        <Button onClick={onAdd}>Ekle</Button>
        {/* option button for different pagination */}
        <select  onChange={(e) => setPostsPerPage(e.target.value)}
        className="form-select form-select-md pegination-button"  
        aria-label=".form-select-md example">
          <option value={postsPerPage}>Sayfala</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
        </select>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th scope="col"># </th>
            <th scope="col">Başlık</th>
            <th scope="col">Durum</th>
            <th scope="col">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {renderBody()}
        </tbody>
      </table>
      {/* rendering pagination component */}
      {Pegination()}
    </>
    )
  }

  const saveChanges = () => {

    // insert 
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map(item => item.id)) + 1;
      setItems(items => {
        items.push(todo)
        return [...items]
      })

      alert("Ekleme işlemi başarıyla gerçekleşti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id === todo.id)
    setItems(items => {
      items[index] = todo
      return [...items]
    })
    setTodo(null)
  }

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false
    })
  }

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const index = items.findIndex(item => item.id === id)
    
    setItems(items => {
      items.splice(index, 1)
      return [...items]
    })
  }

  const onEdit = (todo) => {
    setTodo(todo)
  }
  
  const cancel = () => {
    setTodo(null)
  }

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => setTodo(todos => {
            return {...todos, title: e.target.value}
          })}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => setTodo(todos => {
            return {...todos, completed: e.target.checked}
          })}
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>Vazgeç</Button>
      </>
    )
  }
  
  return (
    <>
      { loading ? "Yükleniyor...." : (todo ? renderEditForm() : renderTable())}
    
    </>
  )
}