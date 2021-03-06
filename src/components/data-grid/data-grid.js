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

  // variables definitions for reverse buttons
  const[reverseListId, setReverseListId] = useState(false);
  const[reverseListTitle, setReverseListTitle] = useState(false);

  // variables definitions for filter button
  const[todoList, setTodoList] = useState("0");
  const [filteredTodos, setFilteredTodos]= useState([]);

  
  //function that sorts objects in array by propname
  const propComparator = (propName) => {
  return (a, b) => a[propName] === b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
  }

  useEffect(() => {
    loadData()
  },[])

  //to filter the list by filter button status
  useEffect(() => {
    const filterHandler = () => {
      switch(todoList){
        case '1':
          setFilteredTodos(items.filter(item => item.completed === true))
          break;
        case '2':
          setFilteredTodos(items.filter(item => item.completed === false))
          break;
        default:
          setFilteredTodos(items)
          break;
      }
    }
    filterHandler()
  },[todoList, items])

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
    // variables definitions for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    // what to do when the reverse buttons are clicked
    filteredTodos.sort(propComparator("id")).reverse();
    if (reverseListId === true) {
      filteredTodos.sort(propComparator("id"));
    }
    if (reverseListTitle === true) {
      filteredTodos.sort(propComparator("title"));
    }
    return (
      <React.Fragment>
        {filteredTodos.slice(indexOfFirstPost, indexOfLastPost).map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamland??" : "Yap??lacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>D??zenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }
  // pegination component
  const Pegination = () => {
    // when we select different page this function changes data shown
    const paginate = (pagenumber) => setCurrentPage(pagenumber);

    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(filteredTodos.length / postsPerPage); i++) {
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
            <th scope="col"># 
              {/* reverse button */}
              <span><button className="reverse-button" onClick={() => setReverseListId(!reverseListId)}> ??? </button></span>
            </th>
            <th scope="col">Ba??l??k
              {/* reverse button */}
              <span><button className="reverse-button" onClick={() => setReverseListTitle(!reverseListTitle)}> ??? </button></span> 
            </th>
            <th scope="col">Durum
              {/* filter button */}
              <span>
                <select className="custom-select my-1 mr-sm-2 todos-button" 
                onChange={(e) => setTodoList(e.target.value)}>
                  <option value="0">Hepsi</option>
                  <option value="1">Tamamland??</option>
                  <option value="2">Yap??lacak</option>
                </select>
              </span>
            </th>
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
        items.push(todo);
        return [...items]
      })

      alert("Ekleme i??lemi ba??ar??yla ger??ekle??ti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id === todo.id);
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
    const status = window.confirm("Silmek istedi??inize emin misiniz?")

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
        <Button className="btn btn-default" onClick={cancel}>Vazge??</Button>
      </>
    )
  }
  
  return (
    <>
      { loading ? "Y??kleniyor...." : (todo ? renderEditForm() : renderTable())}
    
    </>
  )
}