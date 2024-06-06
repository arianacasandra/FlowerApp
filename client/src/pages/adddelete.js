
import { useNavigate } from 'react-router-dom';

function ADDelete() {
 const navigate = useNavigate();
 const handleClick1 = () => {
    navigate('/addflower');
};
const handleClick2 = () => {
    navigate('/deleteflower');
};
const handleClick3 = () => {
    navigate('/login');
};
    return (
        <>
      <table className='login-box'>
    <tr>
        <td className="centered-cell">
            <button onClick={handleClick1}>Add Flower</button>
        </td>
    </tr>
    <tr>
        <td className="centered-cell">
            <button onClick={handleClick2}>Delete Flower</button>
        </td>
    </tr>
    <tr>
        <td className="centered-cell">
            <button onClick={handleClick3}>Go Back</button>
        </td>
    </tr>
</table>
        
       
       
        </>

      
      
    );
}

export default ADDelete;
