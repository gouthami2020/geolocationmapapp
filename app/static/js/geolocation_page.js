'use strict';
const e = React.createElement;

function App() {
  const [list, setList] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [pages, setPages] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [modalDescription, setModalDescription] = React.useState("");
  const [itemId, setItemId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState("");
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);

  const success = (data) => {
    setList(data.data);
    setCount(data.count);
    const newPages = [];
    if (data.count > 10) {
      for (let i=0; i<Math.ceil(data.count / 10); i++) {
        newPages.push({
          name: (i+1).toString(),
          page: i,
        });
        console.log("page",i);
      }
      if (page > newPages.length-1) {
        setPage(page-1);
      }
    } else {
      setPage(0);
    }
    setPages(newPages);
  };

  const logout = async (e)=>{
    await localStorage.setItem("loginToken",null);
    window.location = "/login";
  };

  const getData = ()=>{
    get_geolocations_api(page, success, (text)=>{console.log("Error: ", text)});
  };

  const newGeolocation = ()=>{
    setModalDescription("New Record");
    setItemId(null);
    setName("");
    setLatitude(0);
    setLatitude(0);
    setError("");
    setShowModal(true);
    const itemInput = document.getElementById("itemInput");
    setTimeout(()=>{itemInput && itemInput.focus()}, 1);
  };



  const saveGeolocation = (e)=>{
    e.preventDefault();
    setError("");
    console.log("saving new", name, latitude, longitude);
    if (name === "" || latitude==="" || longitude ==="")
      setError("Please enter item name, price and quantity");
    else {
      if (itemId === null)
        post_geolocation_api({name, latitude, longitude}, ()=>{getData();});
      else
        put_order_api(itemId, {name, latitude, longitude}, ()=>{getData();});
      setShowModal(false);
    }
  };



  const keyDownHandler = (e)=>{
    if (e.which === 27)
      setShowModal(false);
  };

  React.useEffect(()=>{
    getData();
  }, [page]);

  return (
    <div onKeyDown={keyDownHandler}>
      <div style={{background: "#00000060"}}
          className={"modal " + (showModal?" show d-block":" d-none")} tabIndex="-1" role="dialog">
        <div className="modal-dialog shadow">
          <form method="post">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalDescription}</h5>
              <button type="button" className="btn-close" onClick={()=>{setShowModal(false)}} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label>Name</label>
                <div className="form-group">
                  <input type="text" className="form-control" name="name" id="itemInput"
                         value={name} onChange={(e)=>{setName(e.target.value)}}
                         placeholder="Name"/>
                </div>
              <label style={{marginTop: "1em"}}>Latitude</label>
                <div className="form-group" >
                  <input type="text" className="form-control" placeholder="Latitude"
                         value={latitude} onChange={(e)=>{setLatitude(e.target.value)}}
                         name="latitude" />
                </div>
              <label style={{marginTop: "1em"}}>Longitude</label>
                <div className="form-group">
                  <input type="text" className="form-control"
                         value={longitude} onChange={(e)=>{setLongitude(e.target.value)}}
                         placeholder="Longitude" name="longitude" />
                </div>
              <small className="form-text text-muted">{error}</small>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setShowModal(false)}} data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" onClick={saveGeolocation}>Save changes</button>
            </div>
          </div>
          </form>
        </div>
      </div>

      <nav style={{background: "#333", color: "#fff", height: "100%", width: "0", position: "fixed", top: "0", left: "0", opacity: "0.9",paddingTop: "60px"}}>
          <ul className="navlist">
            <li>
              <a className="menu-item" href="/">
                Home
              </a>
            </li>

            <li>
              <a className="menu-item" href="/map" >
                Map
              </a>
            </li>
          </ul>
        </nav>

      <div style={{maxWidth: "800px", margin: "auto", marginTop: "1em", marginBottom: "1em",
                    padding: "1em"}} className="shadow">
        <div style={{display: "flex", flexDirection: "row"}}>
          <span>GEO LOCATION</span>
          <a className="btn btn-light" style={{marginLeft: "auto"}} onClick={logout}>Logout</a>
        </div>
      </div>
      <div style={{maxWidth: "800px", margin: "auto", marginTop: "1em", marginBottom: "1em",
                    padding: "1em"}} className="shadow">
        <div style={{display: "flex", flexDirection: "row", marginBottom: "5px"}}>
          {pages.length > 0 && <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
              <li className={"page-item " + (page === 0?"disabled":"")} onClick={(e)=>{
                    e.preventDefault();
                    setPage(Math.max(page-1,0));
              }}><a className="page-link" href="#" aria-label="Previous"><span
                  aria-hidden="true">«</span></a></li>
              {pages.map((el)=><li key={"page" + el.page} onClick={(e)=>{
                  setPage(el.page);
                }} className={"page-item "+(page===el.page?"active":"")}>
                <a className="page-link" href="#">
                  {el.name}
                </a></li>)}
              <li className={"page-item " + (page === pages.length-1?"disabled":"")} onClick={(e)=>{
                    setPage(Math.min(page+1,pages.length-1));
              }}><a className="page-link" href="#" aria-label="Next"><span
                  aria-hidden="true">»</span></a></li>
            </ul>
          </nav>}
          <a className="btn btn-light" style={{marginLeft: "auto"}}
             onClick={newGeolocation}
          >New Geo Location Add</a>
        </div>
        <table className="table table-hover caption-top">
          <thead className="table-light">
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
          </thead>
          <tbody>
          { list.map((row)=>
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.latitude}</td>
              <td>{row.longitude}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const domContainer = document.querySelector('#reactAppContainer');
ReactDOM.render(
  e(App),
  domContainer
);
