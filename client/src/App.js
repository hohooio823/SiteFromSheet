import React,{useState} from 'react';
import axios from 'axios';
import './App.css';

const App = ()=>{
  const [elements,setElements] = useState([])
  const [link,setLink] = useState('')
  const [page,setPage] = useState('d-flex')
  const [reviewPage,setReviewPage]=useState('d-none')
  const preview = async ()=>{
      const elementList = await axios.post('/preview',{link:link})
      setElements(elementList.data)
      setPage('d-none')
      setReviewPage('d-flex')
  }
  const download = async()=>{
      axios({url: '/download',method: 'post',data:{link:link},responseType: 'blob'})
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const linkEle = document.createElement('a');
        linkEle.href = url;
        linkEle.setAttribute('download', 'index.html');
        document.body.appendChild(linkEle);
        linkEle.click();
      });
  }
  const onChangeInput = (e)=>{
    setLink(e.target.value)
  }
  const closeReview = ()=>{
    setReviewPage('d-none')
    setPage('d-flex')
  }
  return (
    <div className="App ">
      <div className={'container justify-content-center main '+page}>
        <div className="row d-flex w-100"><h1 className='col-12 text-center mb-4 font-weight-bold head'>Site From Sheet <span role='img'>📝</span></h1></div>
        <div className="row d-flex w-100 pl-md-5 ml-md-5"><div className='col-12 mb-2 text-center text-md-left ml-md-5'>If you don't know what this is, 
        check out <span className='guide'><a href="https://github.com/hohooio823/SiteFromSheet" target="_blank" >The guide</a></span></div>
        </div>
        <div className="row d-flex w-75 justify-content-between">
          <div className='col-md-7 col-12 col p-0 file text-center ' >
            <input type="text" className='pt-2 pb-2 w-100' onChange={onChangeInput} placeholder='Paste link to your spreadsheet' />
          </div>
          <div className="d-flex justify-content-center col-md-5 col-12 px-0 px-md-1 ">
          <button className='btn btn-block mt-2 mb-2 pt-2 pb-2 mt-md-0 mb-md-0' onClick={preview}>Preview <span role='img'>👀</span> </button>
          <button className='btn btn-block ml-1 mt-2 mb-2 pt-2 pb-2 mt-md-0 mb-md-0' onClick={download}>Download <span role='img'>🚀</span> </button>
        </div>
        </div>
      </div>
      <button className={'close ' + reviewPage} onClick={closeReview}>Close</button>
      <div className={'container review align-items-center '+ reviewPage} dangerouslySetInnerHTML={{__html:elements}}>
      </div>
    </div>
  );
}

export default App;
