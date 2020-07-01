import React,{useState} from 'react';
import axios from 'axios';
import './App.css';

const App = ()=>{
  const [elements,setElements] = useState([])
  const [link,setLink] = useState('')
  const [page,setPage] = useState('')
  const [reviewPage,setReviewPage]=useState('d-none')
  const preview = async ()=>{
      const elementList = await axios.post('/preview',{link:link})
      setElements(elementList.data)
      setPage('d-none')
      setReviewPage('')
  }
  const download = async()=>{
    //const response = await axios.post('/download',{link:link});
      axios({url: '/download',method: 'post',data:{link:link},responseType: 'blob'})
      .then((response) => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const linkEle = document.createElement('a');
        linkEle.href = url;
        linkEle.setAttribute('download', 'txt.html');
        document.body.appendChild(linkEle);
        linkEle.click();
      });
  }
  const onChangeInput = (e)=>{
    setLink(e.target.value)
  }
  const closeReview = ()=>{
    setReviewPage('d-none')
    setPage('')
  }
  return (
    <div className="App">
      <div className={'container '+page}>
        <div className='row'>
          Hi react
        </div>
        <div className="row"><input onChange={onChangeInput} placeholder='Paste link to your spreadsheet' /></div>
        <div className="row"><button onClick={preview}>preview</button></div>
        <div className="row"><button onClick={download}>download</button></div>
      </div>
      <button className={reviewPage} onClick={closeReview}>Close</button>
      <div className={'container '+ reviewPage} dangerouslySetInnerHTML={{__html:elements}}>
      </div>
    </div>
  );
}

export default App;
