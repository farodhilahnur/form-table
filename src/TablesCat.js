/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import styled from 'styled-components'; 

type Props = {
  className: string
}

interface ICategory {
  isModalOpen: boolean,
  id: number,
  nim: number,
  name: string,
  alamat: string,
  gender: string,
  hobi: string,
  komentar: string,
  lokasi: string,
  search: string,
  coords: number,
  loc:string
}

const API_URL = "https://639eec4f5eb8889197efde56.mockapi.io/users"

export const GET_API_CATEGORY = `${API_URL}`

export const initialsCategory: ICategory = {
  isModalOpen: false,
  id: 0,
  nim: 0,
  name: "",
  alamat: "",
  gender: "",
  hobi: "",
  komentar: "",
  lokasi: "",
  search: "",
  loc:"",
  coords:0
}

const defaultFaq:ICategory[]=[]

const TablesCategory: FC<Props>=({className})=> {
  const apiKey = '2f3c335bd31240c9abd79278a44bedf3';
  const api_location = 'https://ipgeolocation.abstractapi.com/v1/?api_key='+apiKey
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setid] = useState(0);
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [nim, setNim] = useState(0);
  const [alamat, setAlamat] = useState('');
  const [gender, setGender] = useState('');
  const [hobi, setHobi] = useState('');
  const [komentar, setKomentar] = useState('');
  const [sort, setSort] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [loc, setLoc] = useState('');
  const PER_PAGE = 10;

  const geolocationAPI = navigator.geolocation;

  const [category, setCategory]: [ICategory[], (category: ICategory[]) => void] = useState(
    defaultFaq
  );
  const [error, setError]: [string, (error: string) => void] = useState(
    ''
  );

  const handlePageClick = (e: { selected: any }) => {
    const selectedPage = e.selected;
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(category.length / PER_PAGE);
  const categoryPerPage = category.slice(offset, offset + PER_PAGE); 
  const categoryNumber = categoryPerPage.length


  const MyPaginate = styled(ReactPaginate).attrs({
    // You can redifine classes here, if you want.
    activeClassName: 'active', // default to "disabled"
  })`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    list-style-type: none;
    padding: 0 5rem;
    li a {
      border-radius: 7px;
      padding: 0.1rem 1rem;
      border: gray 1px solid;
      cursor: pointer;
    }
    li.previous a,
    li.next a,
    li.break a {
      border-color: transparent;
    }
    li.active a {
      background-color: #0366d6;
      border-color: transparent;
      color: white;
      min-width: 32px;
    }
    li.disabled a {
      color: grey;
    }
    li.disable,
    li.disabled a {
      cursor: default;
    }`;
  

  useEffect(() => {
    getCategoryData();
    getUserLocationFromAPI();
  }, [setCurrentPage]);

  const getCategoryData = () => {
    axios
    .get(GET_API_CATEGORY, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
    .then((response) => {
      const dataRes = response.data
      setCategory(dataRes)
    })
    .catch((ex) => {
      let error = axios.isCancel(ex)
        ? 'Request Cancelled'
        : ex.code === 'ECONNABORTED'
        ? 'A timeout has occurred'
        : ex.response.status === 404
        ? 'Resource Not Found'
        : 'An unexpected error has occurred';

      setError(error);
    });
  }

const handleTrue =() =>{
  setGender('perempuan')
}
const handleFalse =() =>{
  setGender('laki')
}
  const handleClose = () => {
    setIsModalOpen (false)
  }

  const handleChangeSearch = (e: { target: { value: any; }; }) => {
    setSearch(e.target.value);
  }

  const showAlertUpdate = () => {
    swal({
      title: "Success",
      text: "Category Data Was Updated",
      icon: "success",
    });
  }

  const showAlertAdd = () => {
    swal({
      title: "Success",
      text: "Category Data Was Created",
      icon: "success",
    });
  }

  const showAlertDelete = () => {
    swal({
      title: "Success",
      text: "Category Data Was Deleted",
      icon: "success",
    });
  }

  const handleAdd = () => {
    return(
      setIsModalOpen (true),
      setNim (1),
      setName (""),
      setAlamat (""),
      setGender(""),
      setHobi(""),
      setKomentar(""),
      setAction ("insert")
    )
  }

  const handleEdit = (item: { id: number;
    nim: number;
     name : string;
     alamat: string;
     gender: string;
     hobi: string;
     komentar: string}) => {
    let url = GET_API_CATEGORY + `/${item.id}`
    axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
      .then(res => {
        return(
          setIsModalOpen (true),
          setid (item.id),
          setName(item.name),
          setAlamat (item.alamat),
          setGender(item.gender),
          setHobi(item.hobi),
          setKomentar(item.komentar),
          setAction ("update")
        )
      })
      .catch((ex) => {
        let error = axios.isCancel(ex)
          ? 'Request Cancelled'
          : ex.code === 'ECONNABORTED'
          ? 'A timeout has occurred'
          : ex.response.status === 404
          ? 'Resource Not Found'
          : 'An unexpected error has occurred';
  
        setError(error);
      });
  }

  const Drop = (item: { id: number; name : string;sort: number;color: string;availability: string;picture: string;isActive: boolean}) => {
    let url = GET_API_CATEGORY + `/${item.id}`
    if (window.confirm("Are you sure to delete this data?")) {
      axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
        .then(res => {
          showAlertDelete()
          console.log(res.data.message)
          getCategoryData()
        })
        .catch((ex) => {
          let error = axios.isCancel(ex)
            ? 'Request Cancelled'
            : ex.code === 'ECONNABORTED'
            ? 'A timeout has occurred'
            : ex.response.status === 404
            ? 'Resource Not Found'
            : 'An unexpected error has occurred';
    
          setError(error);
        });
    }
  }

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    let formAdd = {
      nim:nim,
      name: name,
      alamat: alamat,
      gender: gender,
      hobi: hobi,
      komentar: komentar,
    }

    let formEdit = {
        id: id,
        nim:nim,
        name: name,
        alamat: alamat,
        gender: gender,
        hobi: hobi,
        komentar: komentar,
    }

    let url = ""
    if (action === "insert") {
      let user_id = 0
      url = GET_API_CATEGORY
      axios.post(url, formAdd)
        .then(response => {
          showAlertAdd()
          getCategoryData()
          handleClose()
        })
        .catch(error => console.log(error))
    } else if (action === "update") {
      let user_id = 0
      url = GET_API_CATEGORY+`/${id}`
      axios.put(url, formEdit)
        .then(response => {
          showAlertUpdate()
          getCategoryData()
          handleClose()
          console.log(id)
        })
        .catch((ex) => {
          let error = axios.isCancel(ex)
            ? 'Request Cancelled'
            : ex.code === 'ECONNABORTED'
            ? 'A timeout has occurred'
            : ex.response.status === 404
            ? 'Resource Not Found'
            : 'An unexpected error has occurred';
    
          setError(error);
        });
    }
    setIsModalOpen(false)
  }
  const reset = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNim(0);
    setName("");
    setGender("");
    setAlamat("");
    setHobi("");
    setKomentar("");
  }

  const getUserLocationFromAPI = () => {
    try {
      // const response = axios.get(api_location);
      axios
      .get(api_location, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      .then((response) => {
        const dataRes = response.data
        console.log(dataRes)
        setLoc(response.data.city);
      })
      
    } catch (error) {
      setError('Something went wrong getting Geolocation from API!')
    }
  }

  // const Image = () => <img src={picture} height='70' width='max-75'></img>
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to filter faq'
        >
          <Button
            className='btn btn-sm btn-light-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_invite_friends'
            onClick={() => handleAdd()}
          >
            New Data
          </Button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-50px'>No</th>
                <th className='min-w-120px'>Nim</th>
                <th className='min-w-140px'>Name</th>
                <th className='min-w-140px'>Alamat</th>
                <th className='min-w-120px'>Gender</th>
                <th className='min-w-120px'>Hobi</th>
                <th className='min-w-120px'>Komentar</th>
                <th className='min-w-100px'>Lokasi</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {categoryPerPage.map((item, index) => {
                  return (
                  <tr key={index}>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {(currentPage*PER_PAGE) + index+1}
                    </td>
                    <td className="rounded-circle fs-6 text-center">
                      {item.nim}
                    </td>
                   
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {item.name}
                    </td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {item.alamat}
                    </td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>{item.gender}</td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>{item.hobi}</td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>{item.komentar}</td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {loc}
                    </td>
                  </tr>
                )
              }
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}

      <Modal
      id='kt_modal_create_app'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered mw-900px'
      show={isModalOpen}
      onHide={handleClose}
    >
      <div className='modal-header'>
       {action=="update" ? <h2>Edit FAQ</h2> : <h2>Create Data</h2>}
        {/* begin::Close */}
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={handleClose}>
        </div>
        {/* end::Close */}
      </div>

      <div className='modal-body py-lg-10 px-lg-10'>
      <div className='current' data-kt-stepper-element='content'>
      <div className='w-100'>
          {/*begin::Form Group */}
          <div className='fv-row mb-2'>
          <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
            <span >Nim</span>
          </label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='nim'
            placeholder=''
            value={nim}
            onChange={event => {
              setNim(parseInt(event.target.value))}}
            />
          {!name && (
            <div className='fv-plugins-message-container'>
              <div data-field='nim' data-validator='notEmpty' className='fv-help-block'>
                Nim is required
              </div>
            </div>
          )}
        </div>
        {/*end::Form Group */}

        {/*begin::Form Group */}
        <div className='fv-row mb-2'>
          <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
            <span >Nama</span>
          </label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='question'
            placeholder=''
            value={name}
            onChange={event => {
              setName(event.target.value)}}
          />
          {!name && (
            <div className='fv-plugins-message-container'>
              <div data-field='question' data-validator='notEmpty' className='fv-help-block'>
                name is required
              </div>
            </div>
          )}
        </div>
        {/*end::Form Group */}

        {/*begin::Form Group */}
        <div className='fv-row mt-4 mb-2'>
          <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
            <span >Alamat</span>
          </label>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='alamat'
            placeholder=''
            value={alamat}
            onChange={event => {
              setAlamat(event.target.value)}}
          />
          {!alamat && (
            <div className='fv-plugins-message-container'>
              <div data-field='alamat' data-validator='notEmpty' className='fv-help-block'>
                alamat is required
              </div>
            </div>
          )}
        </div>
        {/*end::Form Group */}

            {/*begin::Form Group */}
        <div className='fv-row mt-4'>
          {/* begin::Label */}
          <label className='d-flex align-items-center fs-5 fw-semibold mb-4'>
            <span >Jenis Kelamin</span>
          </label>
          {/* end::Label */}
          <div>
            {/*begin:Option */}
            <label className='d-flex align-items-center justify-content-between mb-6 cursor-pointer'>
              <span className='d-flex align-items-center me-2'>
                <span className='symbol symbol-50px me-6'>
                  <span className='symbol-label bg-light-primary'>
                    
                  </span>
                </span>

                <span className='d-flex flex-column'>
                  <span className='fw-bolder fs-6'>Perempuan</span>
                </span>
              </span>

              <span className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='gender'
                  value='perempuan'
                  onClick={handleTrue}
                />
              </span>
            </label>
            {/*end::Option */}
            
            {/*begin:Option */}
            <label className='d-flex align-items-center justify-content-between mb-6 cursor-pointer'>
              <span className='d-flex align-items-center me-2'>
                <span className='symbol symbol-50px me-6'>
                  <span className='symbol-label bg-light-danger'>
                    
                  </span>
                </span>

                <span className='d-flex flex-column'>
                  <span className='fw-bolder fs-6'>Laki-Laki</span>
                </span>
              </span>

              <span className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='gender'
                  value='laki'
                  onClick={handleFalse}
                />
              </span>
            </label>
            {/*end::Option */}
          </div>
          {/*begin::Form Group */}
        <div className='fv-row mt-4 mb-2'>
          <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
            <span >Hobi</span>
          </label>
          <input
            type= "text"
            className='form-control form-control-lg form-control-solid'
            name='hobi'
            value={hobi}
            onChange={event =>{
              setHobi(event.target.value)
            }}
          />
          {!hobi && (
            <div className='fv-plugins-message-container'>
              <div data-field='hobi' data-validator='notEmpty' className='fv-help-block'>
                Hobi is required
              </div>
            </div>
          )}
        </div>
        {/*end::Form Group */}
        {/*begin::Form Group */}
        <div className='fv-row mt-4 mb-2'>
          <label className='d-flex align-items-center fs-5 fw-semibold mb-2'>
            <span >Komentar</span>
          </label>
          <input
            type= "text"
            className='form-control form-control-lg form-control-solid'
            name='komentar'
            value={komentar}
            onChange={event =>{
              setKomentar(event.target.value)
            }}
          />
          {!komentar && (
            <div className='fv-plugins-message-container'>
              <div data-field='komentar' data-validator='notEmpty' className='fv-help-block'>
                Hobi is required
              </div>
            </div>
          )}
        </div>
        {/*end::Form Group */}
            <div> 
              <button
                  type='button'
                  className='d-flex btn btn-lg btn-danger'
                  data-kt-stepper-action='submit'
                  onClick={(e) => reset(e)}
                >
                  Clear
                </button>
              </div>
              <div>
                <button
                  type='button'
                  className='d-flex align-items-center btn btn-lg btn-primary'
                  data-kt-stepper-action='submit'
                  onClick={(e) => handleSave(e)}
                >
                  Submit{' '}
                </button>
              </div>
              {/*end::Form Group */}
        </div>
    </div>
    </div>
    </div>
    </Modal>

    </div>
  )
}

export {TablesCategory}
