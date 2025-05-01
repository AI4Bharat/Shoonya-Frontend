 
import { useEffect,useState } from 'react'
export default function Error({ error, reset,onClose }) {

  const [err, seterr] = useState(error);
const handleclose=()=>{
   seterr(null)
}


return (
    err ? (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'transparent', padding: '20px', maxWidth: '80%', maxHeight: '80%', overflow: 'auto' }}>
          <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '18px', color: 'white', fontWeight:"bolder" }} onClick={handleclose}>X</button>
          <h1 style={{ color: 'red', fontWeight: 'bolder', marginBottom: '20px' }}>Compiled With Problem :</h1>
          <div style={{ maxHeight: 'calc(100% - 60px)', overflowY: 'auto', padding: '10px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'auto' }}>{error.stack}</pre> {/* Display full error stack */}
          </div>
          <button style={{ marginTop: '20px', color: 'blue' }} onClick={reset}>Try again</button>
        </div>
      </div>
    ) : null
  );
}
